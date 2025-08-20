import { CulturasPlantadasRepository } from '../culturas-plantadas.repository';
import { db } from 'src/db/connection';
import { culturasPlantadas } from 'src/db/schema/culturas_plantadas';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

jest.mock('src/db/connection', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

function makeCulturaPlantada(overrides = {}) {
  return {
    id: 1,
    nome: 'Soja',
    fazendaId: 1,
    safraId: 1,
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

describe('CulturasPlantadasRepository', () => {
  let repository: CulturasPlantadasRepository;

  beforeEach(() => {
    repository = new CulturasPlantadasRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma cultura plantada', async () => {
      const cultura = makeCulturaPlantada();
      const createDto = {
        nome: 'Soja',
        fazendaId: 1,
        safraId: 1,
      };
      
      (db.insert as jest.Mock).mockReturnValue({
        values: () => ({
          returning: () => [cultura],
        }),
      });

      const result = await repository.create(createDto);

      expect(result).toEqual([cultura]);
      expect(db.insert).toHaveBeenCalledWith(culturasPlantadas);
    });
  });

  describe('findAll', () => {
    it('deve buscar todas as culturas plantadas do usuário', async () => {
      const user = makeUser();
      const culturasList = [makeCulturaPlantada(), makeCulturaPlantada({ id: 2, nome: 'Milho' })];
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            innerJoin: () => ({
              innerJoin: () => ({
                where: () => culturasList,
              }),
            }),
          }),
        }),
      });

      const result = await repository.findAll(user);

      expect(result).toEqual(culturasList);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma cultura plantada pelo id e userId', async () => {
      const cultura = makeCulturaPlantada();
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            innerJoin: () => ({
              innerJoin: () => ({
                where: () => [cultura],
              }),
            }),
          }),
        }),
      });

      const result = await repository.findOne(1, 1);

      expect(result).toEqual(cultura);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar uma cultura plantada', async () => {
      const updatedCultura = makeCulturaPlantada({ nome: 'Algodão' });
      const updateDto = { nome: 'Algodão' };
      
      (db.update as jest.Mock).mockReturnValue({
        set: () => ({
          where: () => ({
            returning: () => [updatedCultura],
          }),
        }),
      });

      const result = await repository.update(1, updateDto);

      expect(result).toEqual([updatedCultura]);
      expect(db.update).toHaveBeenCalledWith(culturasPlantadas);
    });
  });

  describe('remove', () => {
    it('deve remover uma cultura plantada', async () => {
      const mockRowList = [] as any;
      (db.delete as jest.Mock).mockReturnValue({
        where: () => ({
          returning: () => mockRowList,
        }),
      });

      const result = await repository.remove(1);

      expect(result).toEqual(mockRowList);
      expect(db.delete).toHaveBeenCalledWith(culturasPlantadas);
    });
  });

  describe('validateCulturasPlantadasOwnership', () => {
    it('deve validar a propriedade da cultura plantada', async () => {
      const validationResult = [{}];
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => validationResult,
          }),
        }),
      });

      const result = await repository.validateCulturasPlantadasOwnership(1, 1);

      expect(result).toEqual(validationResult);
      expect(db.select).toHaveBeenCalled();
    });
  });
});