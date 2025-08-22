import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getDashboardData(userId: number): Promise<DashboardResponseDto> {
    const [totals, byState, byCulture, landUse] = await Promise.all([
      this.dashboardRepository.getTotals(userId),
      this.dashboardRepository.getByState(userId),
      this.dashboardRepository.getByCulture(userId),
      this.dashboardRepository.getLandUse(userId),
    ]);

    return {
      totals,
      byState,
      byCulture,
      landUse,
    };
  }
}