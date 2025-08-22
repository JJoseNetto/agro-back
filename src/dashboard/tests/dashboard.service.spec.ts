import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../dashboard.service';
import { DashboardRepository } from '../dashboard.repository';

describe('DashboardService', () => {
  let service: DashboardService;
  let repository: DashboardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: DashboardRepository,
          useValue: {
            getTotals: jest.fn(),
            getByState: jest.fn(),
            getByCulture: jest.fn(),
            getLandUse: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    repository = module.get<DashboardRepository>(DashboardRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard data', async () => {
    const mockTotals = { totalFazendas: 10, totalHectares: 1000 };
    const mockByState = [{ name: 'SP', value: 5 }];
    const mockByCulture = [{ name: 'Soja', value: 8 }];
    const mockLandUse = [{ name: 'Área Agricultável', value: 800 }];

    jest.spyOn(repository, 'getTotals').mockResolvedValue(mockTotals);
    jest.spyOn(repository, 'getByState').mockResolvedValue(mockByState);
    jest.spyOn(repository, 'getByCulture').mockResolvedValue(mockByCulture);
    jest.spyOn(repository, 'getLandUse').mockResolvedValue(mockLandUse);

    const result = await service.getDashboardData(1);

    expect(result).toEqual({
      totals: mockTotals,
      byState: mockByState,
      byCulture: mockByCulture,
      landUse: mockLandUse,
    });
  });
});