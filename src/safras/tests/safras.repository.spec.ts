import { SafrasRepository } from '../safras.repository';
import { db } from 'src/db/connection';
import { safras } from 'src/db/schema/safras';
import { eq } from 'drizzle-orm';

jest.mock('src/db/connection', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

function makeSafra(overrides = {}) {
  return {
    id: 1,
    ano: 2025,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('SafrasRepository', () => {
  let repository: SafrasRepository;

  beforeEach(() => {
    repository = new SafrasRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma safra', async () => {
      const safra = makeSafra();
      const createDto = { ano: 2025 };
      
      (db.insert as jest.Mock).mockReturnValue({
        values: () => ({
          returning: () => [safra],
        }),
      });

      const result = await repository.create(createDto);

      expect(result).toEqual([safra]);
      expect(db.insert).toHaveBeenCalledWith(safras);
    });
  });

  describe('findAll', () => {
    it('deve buscar todas as safras ordenadas por ano', async () => {
      const safrasList = [makeSafra(), makeSafra({ id: 2, ano: 2024 })];
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          orderBy: () => safrasList,
        }),
      });

      const result = await repository.findAll();

      expect(result).toEqual(safrasList);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma safra pelo id', async () => {
      const safra = makeSafra();
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: () => [safra],
          }),
        }),
      });

      const result = await repository.findOne(1);

      expect(result).toEqual([safra]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar uma safra', async () => {
      const updatedSafra = makeSafra({ ano: 2026 });
      const updateDto = { ano: 2026 };
      
      (db.update as jest.Mock).mockReturnValue({
        set: () => ({
          where: () => ({
            returning: () => [updatedSafra],
          }),
        }),
      });

      const result = await repository.update(1, updateDto);

      expect(result).toEqual([updatedSafra]);
      expect(db.update).toHaveBeenCalledWith(safras);
    });
  });

  describe('remove', () => {
    it('deve remover uma safra', async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: () => ({ success: true }),
      });

      const result = await repository.remove(1);

      expect(result).toEqual({ success: true });
      expect(db.delete).toHaveBeenCalledWith(safras);
    });
  });
});