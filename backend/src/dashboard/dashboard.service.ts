import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayAppointments,
      scheduledToday,
      inProgress,
      totalPatients,
      activeDoctors,
      totalAppointments,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          scheduledAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      this.prisma.appointment.count({
        where: {
          scheduledAt: {
            gte: today,
            lt: tomorrow,
          },
          status: 'SCHEDULED',
        },
      }),
      this.prisma.appointment.count({
        where: {
          status: 'IN_PROGRESS',
        },
      }),
      this.prisma.patient.count({
        where: { isActive: true },
      }),
      this.prisma.doctor.count({
        where: { isActive: true },
      }),
      this.prisma.appointment.count(),
    ]);

    return {
      todayAppointments,
      scheduledToday,
      inProgress,
      totalPatients,
      activeDoctors,
      totalAppointments,
    };
  }

  async getWeeklyStats() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: weekAgo,
          lte: today,
        },
      },
      select: {
        scheduledAt: true,
        status: true,
      },
    });

    // Group by day
    const byDay = appointments.reduce((acc, app) => {
      const day = app.scheduledAt.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = { total: 0, completed: 0, cancelled: 0 };
      }
      acc[day].total++;
      if (app.status === 'COMPLETED') acc[day].completed++;
      if (app.status === 'CANCELLED') acc[day].cancelled++;
      return acc;
    }, {});

    return byDay;
  }

  async getMonthlyStats() {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [appointments, revenue] = await Promise.all([
      this.prisma.appointment.findMany({
        where: {
          scheduledAt: {
            gte: monthAgo,
            lte: today,
          },
        },
        select: {
          scheduledAt: true,
          status: true,
        },
      }),
      this.prisma.appointment.count({
        where: {
          scheduledAt: {
            gte: monthAgo,
            lte: today,
          },
          status: 'COMPLETED',
        },
      }),
    ]);

    return {
      totalAppointments: appointments.length,
      completedAppointments: revenue,
      byStatus: {
        scheduled: appointments.filter((a) => a.status === 'SCHEDULED').length,
        completed: appointments.filter((a) => a.status === 'COMPLETED').length,
        cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
        noShow: appointments.filter((a) => a.status === 'NO_SHOW').length,
      },
    };
  }

  async getRecentActivity(limit = 10) {
    const appointments = await this.prisma.appointment.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      include: {
        patient: {
          select: {
            name: true,
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return appointments;
  }
}
