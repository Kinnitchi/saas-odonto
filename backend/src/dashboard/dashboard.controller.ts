import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview' })
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly statistics' })
  getWeeklyStats() {
    return this.dashboardService.getWeeklyStats();
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly statistics' })
  getMonthlyStats() {
    return this.dashboardService.getMonthlyStats();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent activity' })
  getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }
}
