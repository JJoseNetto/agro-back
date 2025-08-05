import { Test, TestingModule } from '@nestjs/testing';
import { FazendasService } from './fazendas.service';
import { BadRequestException } from '@nestjs/common';

const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

function makeFazenda(overrides = {}) {
  return {
    id: 1,
    nome: 'Fazenda São José',
    cidade: 'São Paulo',
    estado: 'SP',
    areaTotal: '100.5',
    areaAgricultavel: '80.0',
    areaVegetacao: '20.5',
    produtorId: 1,
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

describe('FazendasService', () => {
  let service: FazendasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FazendasService],
    }).compile();

    service = module.get<FazendasService>(FazendasService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve lançar erro se soma das áreas ultrapassar área total', async () => {
      const dto = {
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: '100',
        areaAgricultavel: '80',
        areaVegetacao: '30', // 80 + 30 = 110 > 100
        produtorId: 1,
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda',
      );
    });

    it('deve criar uma fazenda com áreas válidas', async () => {
      const dto = {
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: '100',
        areaAgricultavel: '70',
        areaVegetacao: '30', // 70 + 30 = 100
        produtorId: 1,
      };

      const fazenda = makeFazenda({ ...dto });
      mockDb.insert.mockReturnValueOnce({
        values: () => ({
          returning: () => [fazenda],
        }),
      });

      const result = await service.create(dto);
      expect(result).toEqual([fazenda]);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as fazendas', async () => {
      const fazendas = [makeFazenda(), makeFazenda({ id: 2, nome: 'Fazenda 2' })];
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          orderBy: () => fazendas,
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual(fazendas);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma fazenda pelo ID', async () => {
      const fazenda = makeFazenda();
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [fazenda],
        }),
      });

      const result = await service.findOne(1);
      expect(result).toEqual([fazenda]);
    });
  });

  describe('update', () => {
    it('deve lançar erro se soma das áreas ultrapassar área total na atualização', async () => {
      const dto = {
        areaTotal: '100',
        areaAgricultavel: '80',
        areaVegetacao: '30', // 80 + 30 = 110 > 100
      };

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
    });

    it('deve atualizar uma fazenda com áreas válidas', async () => {
      const dto = {
        nome: 'Fazenda Atualizada',
        areaTotal: '150',
        areaAgricultavel: '100',
        areaVegetacao: '50',
      };

      const fazendaAtualizada = makeFazenda({ ...dto });
      mockDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => [fazendaAtualizada],
          }),
        }),
      });

      const result = await service.update(1, dto);
      expect(result).toEqual([fazendaAtualizada]);
    });
  });

  describe('remove', () => {
    it('deve remover uma fazenda', async () => {
      mockDb.delete.mockReturnValueOnce({
        where: () => ({ success: true }),
      });

      const result = await service.remove(1);
      expect(result).toEqual({ success: true });
    });
  });
});
