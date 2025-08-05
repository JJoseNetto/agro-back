import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorService } from './produtor.service';
import { BadRequestException } from '@nestjs/common';


const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

function makeProdutor(overrides = {}) {
  return {
    id: 1,
    nome: 'João',
    cpfOuCnpj: '123.456.789-00',
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

describe('ProdutorService', () => {
  let service: ProdutorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutorService],
    }).compile();

    service = module.get<ProdutorService>(ProdutorService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve lançar erro se CPF/CNPJ já existir', async () => {
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => [{ id: 1 }],
          }),
        }),
      });

      await expect(
        service.create({ nome: 'João', cpfOuCnpj: '123.456.789-00' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve criar produtor se CPF/CNPJ for novo', async () => {
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => [],
          }),
        }),
      });

      const produtor = makeProdutor();
      const retorno = [produtor];
      mockDb.insert.mockReturnValueOnce({
        values: () => ({
          returning: () => retorno,
        }),
      });

      const result = await service.create({ nome: produtor.nome, cpfOuCnpj: produtor.cpfOuCnpj });
      expect(result).toEqual(retorno);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtores', async () => {
      const data = [makeProdutor(), makeProdutor({ id: 2, nome: 'Maria', cpfOuCnpj: '456.789.123-00' })];
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          orderBy: () => data,
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('deve retornar um produtor pelo ID', async () => {
      const data = [makeProdutor()];
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => data,
          }),
        }),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(data);
    });
  });

  describe('update', () => {
    it('deve atualizar um produtor', async () => {
      const updateData = [makeProdutor({ nome: 'Atualizado', cpfOuCnpj: '999.999.999-99' })];
      mockDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => updateData,
          }),
        }),
      });

      const result = await service.update(1, { nome: 'Atualizado', cpfOuCnpj: '999.999.999-99' });
      expect(result).toEqual(updateData);
    });
  });

  describe('remove', () => {
    it('deve remover um produtor', async () => {
      const retorno = [makeProdutor()];
      mockDb.delete.mockReturnValueOnce({
        where: () => ({
          returning: () => retorno,
        }),
      });

      const result = await service.remove(1);
      expect(result).toEqual(retorno);
    });
  });
});
