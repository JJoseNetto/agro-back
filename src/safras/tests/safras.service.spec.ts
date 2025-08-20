import { Test, TestingModule } from '@nestjs/testing';
import { SafrasService } from '../safras.service';
import { SafrasRepository } from '../safras.repository';
import { CreateSafraDto } from '../dto/create-safra.dto';
import { UpdateSafraDto } from '../dto/update-safra.dto';

function makeSafra(overrides = {}) {
  return {
    id: 1,
    ano: 2025,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('SafrasService', () => {
  let service: SafrasService;
  let repository: jest.Mocked<SafrasRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SafrasService,
        {
          provide: SafrasRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SafrasService>(SafrasService);
    repository = module.get(SafrasRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma safra com sucesso', async () => {
      const dto: CreateSafraDto = { ano: 2025 };
      const safra = makeSafra(dto);
      repository.create.mockResolvedValue([safra]);

      const result = await service.create(dto);

      expect(result).toEqual([safra]);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as safras', async () => {
      const safrasList = [makeSafra(), makeSafra({ id: 2, ano: 2024 })];
      repository.findAll.mockResolvedValue(safrasList);

      const result = await service.findAll();

      expect(result).toEqual(safrasList);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma safra existente', async () => {
      const safra = makeSafra();
      repository.findOne.mockResolvedValue([safra]);

      const result = await service.findOne(1);

      expect(result).toEqual([safra]);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve atualizar uma safra com sucesso', async () => {
      const dto: UpdateSafraDto = { ano: 2026 };
      const safra = makeSafra({ ano: 2026 });
      repository.update.mockResolvedValue([safra]);

      const result = await service.update(1, dto);

      expect(result).toEqual([safra]);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('deve remover uma safra', async () => {
      const mockRowList = [] as any;
      repository.remove.mockResolvedValue(mockRowList);

      const result = await service.remove(1);

      expect(result).toEqual(mockRowList);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});