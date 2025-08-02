import { Test, TestingModule } from '@nestjs/testing';
import { FazendasService } from './fazendas.service';

describe('FazendasService', () => {
  let service: FazendasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FazendasService],
    }).compile();

    service = module.get<FazendasService>(FazendasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
