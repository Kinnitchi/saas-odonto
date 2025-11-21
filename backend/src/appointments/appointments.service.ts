import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { patientId, doctorId, scheduledAt, duration, status, notes } = createAppointmentDto;

    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Verify doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check for conflicts
    const scheduledDate = new Date(scheduledAt);
    const endDate = new Date(scheduledDate.getTime() + (duration || 60) * 60000);

    const conflicts = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledAt: {
          gte: scheduledDate,
          lt: endDate,
        },
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (conflicts.length > 0) {
      throw new BadRequestException('Time slot already booked');
    }

    return this.prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        scheduledAt: scheduledDate,
        duration: duration || 60,
        status: status || 'SCHEDULED',
        notes,
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(doctorId?: string, patientId?: string, status?: string, date?: string) {
    const where: any = {};

    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.scheduledAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            attachments: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findOne(id);

    const data: any = { ...updateAppointmentDto };

    if (data.scheduledAt) {
      data.scheduledAt = new Date(data.scheduledAt);
    }

    return this.prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.appointment.delete({ where: { id } });
  }

  async getUpcoming(doctorId?: string, limit = 10) {
    const where: any = {
      scheduledAt: {
        gte: new Date(),
      },
      status: {
        in: ['SCHEDULED', 'IN_PROGRESS'],
      },
    };

    if (doctorId) where.doctorId = doctorId;

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: limit,
    });
  }
}
