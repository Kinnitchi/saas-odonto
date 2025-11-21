import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    const data: any = { ...createPatientDto };

    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    return this.prisma.patient.create({ data });
  }

  async findAll(search?: string, tag?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = { has: tag };
    }

    return this.prisma.patient.findMany({
      where,
      include: {
        appointments: {
          take: 5,
          orderBy: { scheduledAt: 'desc' },
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { scheduledAt: 'desc' },
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
          },
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    await this.findOne(id);

    const data: any = { ...updatePatientDto };

    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    return this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.patient.delete({ where: { id } });
  }

  async getStats() {
    const total = await this.prisma.patient.count();
    const active = await this.prisma.patient.count({
      where: { isActive: true },
    });
    const byTag = await this.prisma.patient.groupBy({
      by: ['tags'],
      _count: true,
    });

    return {
      total,
      active,
      inactive: total - active,
      byTag,
    };
  }
}
