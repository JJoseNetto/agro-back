import { FazendasRepository } from '../fazendas.repository';
import { db } from 'src/db/connection';
import { fazendas } from 'src/db/schema/fazendas';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

jest.mock('src/db/connection', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

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

function makeUser(overrides = {}): CurrentUserDto {
  return {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

describe('FazendasRepository', () => {
  let repository: FazendasRepository;

  beforeEach(() => {
    repository = new FazendasRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma fazenda', async () => {
      const fazenda = makeFazenda();
      const createDto = {
        nome: 'Fazenda São José',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: '100.5',
        areaAgricultavel: '80.0',
        areaVegetacao: '20.5',
        produtorId: 1,
      };
      
      (db.insert as jest.Mock).mockReturnValue({
        values: () => ({
          returning: () => [fazenda],
        }),
      });

      const result = await repository.create(createDto);

      expect(result).toEqual([fazenda]);
      expect(db.insert).toHaveBeenCalledWith(fazendas);
    });
  });

  describe('findAll', () => {
    it('deve buscar todas as fazendas do usuário', async () => {
      const user = makeUser();
      const fazendasList = [makeFazenda(), makeFazenda({ id: 2, nome: 'Fazenda Santa Maria' })];
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => fazendasList,
          }),
        }),
      });

      const result = await repository.findAll(user);

      expect(result).toEqual(fazendasList);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma fazenda pelo id e userId', async () => {
      const fazenda = makeFazenda();
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => [fazenda],
          }),
        }),
      });

      const result = await repository.findOne(1, 1);

      expect(result).toEqual(fazenda);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar uma fazenda', async () => {
      const updatedFazenda = makeFazenda({ nome: 'Fazenda Atualizada' });
      const updateDto = { nome: 'Fazenda Atualizada' };
      
      (db.update as jest.Mock).mockReturnValue({
        set: () => ({
          where: () => ({
            returning: () => [updatedFazenda],
          }),
        }),
      });

      const result = await repository.update(1, updateDto);

      expect(result).toEqual([updatedFazenda]);
      expect(db.update).toHaveBeenCalledWith(fazendas);
    });
  });

  describe('remove', () => {
    it('deve remover uma fazenda', async () => {
      const mockRowList = [] as any;
      (db.delete as jest.Mock).mockReturnValue({
        where: () => ({
          returning: () => mockRowList,
        }),
      });

      const result = await repository.remove(1);

      expect(result).toEqual(mockRowList);
      expect(db.delete).toHaveBeenCalledWith(fazendas);
    });
  });

  describe('validateFazendaOwnership', () => {
    it('deve validar a propriedade da fazenda', async () => {
      const validationResult = [{}];
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => validationResult,
        }),
      });

      const result = await repository.validateFazendaOwnership(1, 1);

      expect(result).toEqual(validationResult);
      expect(db.select).toHaveBeenCalled();
    });
  });
});