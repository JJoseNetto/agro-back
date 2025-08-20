import { ProdutorRepository } from '../produtor.repository';
import { db } from 'src/db/connection';
import { produtores } from 'src/db/schema/produtor';
import { eq, and } from 'drizzle-orm';

jest.mock('src/db/connection', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

function makeProdutor(overrides = {}) {
  return {
    id: 1,
    nome: 'João da Silva',
    cpfOuCnpj: '123.456.789-00',
    createdAt: new Date(),
    userId: 1,
    ...overrides,
  };
}

describe('ProdutorRepository', () => {
  let repository: ProdutorRepository;

  beforeEach(() => {
    repository = new ProdutorRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um produtor', async () => {
      const produtor = makeProdutor();
      (db.insert as jest.Mock).mockReturnValue({
        values: () => ({
          returning: () => [produtor],
        }),
      });

      const result = await repository.create(produtor, 1);

      expect(result).toEqual([produtor]);
      expect(db.insert).toHaveBeenCalledWith(produtores);
    });
  });

  describe('findAll', () => {
    it('deve buscar todos produtores do usuário', async () => {
      const produtoresList = [makeProdutor()];
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => produtoresList,
        }),
      });

      const result = await repository.findAll(1);

      expect(result).toEqual(produtoresList);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um produtor pelo id e userId', async () => {
      const produtor = makeProdutor();
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => [produtor],
        }),
      });

      const result = await repository.findOne(1, 1);

      expect(result).toEqual([produtor]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar um produtor', async () => {
      const produtor = makeProdutor({ nome: 'Atualizado' });
      (db.update as jest.Mock).mockReturnValue({
        set: () => ({
          where: () => ({
            returning: () => [produtor],
          }),
        }),
      });

      const result = await repository.update(1, 1, { nome: 'Atualizado' });

      expect(result).toEqual([produtor]);
      expect(db.update).toHaveBeenCalledWith(produtores);
    });
  });

  describe('remove', () => {
    it('deve remover um produtor', async () => {
      const produtor = makeProdutor();
      (db.delete as jest.Mock).mockReturnValue({
        where: () => ({
          returning: () => [produtor],
        }),
      });

      const result = await repository.remove(1);

      expect(result).toEqual([produtor]);
      expect(db.delete).toHaveBeenCalledWith(produtores);
    });
  });

  describe('findByCpfProdutor', () => {
    it('deve retornar um produtor pelo CPF', async () => {
      const produtor = makeProdutor();
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: () => [produtor],
          }),
        }),
      });

      const result = await repository.findByCpfProdutor('123.456.789-00');

      expect(result).toEqual([produtor]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('validateProdutorOwnership', () => {
    it('deve retornar true se produtor pertence ao usuário', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: () => [{ id: 1 }],
          }),
        }),
      });

      const result = await repository.validateProdutorOwnership(1, 1);

      expect(result).toBe(true);
    });

    it('deve retornar false se produtor NÃO pertence ao usuário', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: () => [],
          }),
        }),
      });

      const result = await repository.validateProdutorOwnership(1, 2);

      expect(result).toBe(false);
    });
  });
});
