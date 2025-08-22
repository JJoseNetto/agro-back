import { ApiProperty } from '@nestjs/swagger';

export class DashboardTotalsDto {
  @ApiProperty({ description: 'Total de fazendas cadastradas' })
  totalFazendas: number;

  @ApiProperty({ description: 'Total de hectares registrados' })
  totalHectares: number;
}

export class PieChartDataDto {
  @ApiProperty({ description: 'Nome do item' })
  name: string;

  @ApiProperty({ description: 'Valor/quantidade' })
  value: number;
}

export class DashboardResponseDto {
  @ApiProperty({ type: DashboardTotalsDto })
  totals: DashboardTotalsDto;

  @ApiProperty({ type: [PieChartDataDto], description: 'Distribuição por estado' })
  byState: PieChartDataDto[];

  @ApiProperty({ type: [PieChartDataDto], description: 'Distribuição por cultura' })
  byCulture: PieChartDataDto[];

  @ApiProperty({ type: [PieChartDataDto], description: 'Uso do solo' })
  landUse: PieChartDataDto[];
}