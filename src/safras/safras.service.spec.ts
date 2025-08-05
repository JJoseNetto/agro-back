import { Test, TestingModule } from '@nestjs/testing';
import { SafrasService } from './safras.service';

const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

function makeSafra(overrides = {}) {
  return {
    id: 1,
    ano: 2025,
    createdAt: new Date(),
    ...overrides,
  };
}

jest.mock('../db/connection', () => ({
  db: {
    select: (...args: any[]) => mockDb.select(...args),
    insert: (...args: any[]) => mockDb.insert(...args),
    update: (...args: any[]) => mockDb.update(...args),
    delete: (...args: any[]) => mockDb.delete(...args),
  },
}));

describe('SafrasService', () => {
  let service: SafrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafrasService],
    }).compile();

    service = module.get<SafrasService>(SafrasService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma safra', async () => {
      const dto = {
        ano: 2025,
      };

      const safra = makeSafra({ ano: dto.ano });
      mockDb.insert.mockReturnValueOnce({
        values: () => ({
          returning: () => [safra],
        }),
      });

      const result = await service.create(dto);
      expect(result).toEqual([safra]);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as safras ordenadas por ano', async () => {
      const safras = [makeSafra({ ano: 2024 }), makeSafra({ id: 2, ano: 2025 })];
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          orderBy: () => safras,
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual(safras);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma safra pelo ID', async () => {
      const safra = makeSafra();
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [safra],
        }),
      });

      const result = await service.findOne(1);
      expect(result).toEqual([safra]);
    });
  });

  describe('update', () => {
    it('deve atualizar uma safra', async () => {
      const dto = {
        ano: 2026,
      };

      const safraAtualizada = makeSafra({ ano: dto.ano });
      mockDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => [safraAtualizada],
          }),
        }),
      });

      const result = await service.update(1, dto);
      expect(result).toEqual([safraAtualizada]);
    });
  });

  describe('remove', () => {
    it('deve remover uma safra', async () => {
      mockDb.delete.mockReturnValueOnce({
        where: () => ({ success: true }),
      });

      const result = await service.remove(1);
      expect(result).toEqual({ success: true });
    });
  });
});
