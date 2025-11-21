import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    return this.prisma.doctor.create({
      data: createDoctorDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
          },
        },
        appointments: {
          include: {
            patient: true,
          },
          orderBy: {
            scheduledAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.findOne(id);

    return this.prisma.doctor.update({
      where: { id: doctor.id },
      data: updateDoctorDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const doctor = await this.findOne(id);
    return this.prisma.doctor.delete({ where: { id: doctor.id } });
  }

  async findActiveSchedules() {
    return this.prisma.doctor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        cro: true,
        specialty: true,
        workSchedule: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
