import { UsersRepository } from '../users.repository';
import { db } from 'src/db/connection';
import { users } from 'src/db/schema/users';

jest.mock('src/db/connection', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

function makeUser(overrides = {}) {
  return {
    id: 1,
    email: 'user@example.com',
    password: '$2b$10$hashedpassword',
    nome: 'João Silva',
    role: 'user',
    isActive: 1,
    createdAt: new Date(),
    updatedAt: null,
    ...overrides,
  };
}

describe('UsersRepository', () => {
  let repository: UsersRepository;

  beforeEach(() => {
    repository = new UsersRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um usuário', async () => {
      const user = makeUser();
      const createDto = {
        email: 'user@example.com',
        password: 'senha123',
        nome: 'João Silva',
        isActive: true,
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: () => ({
          returning: () => [user],
        }),
      });

      const result = await repository.create(createDto, '$2b$10$hashedpassword');

      expect(result).toEqual([user]);
      expect(db.insert).toHaveBeenCalledWith(users);
    });
  });

  describe('findAll', () => {
    it('deve buscar todos os usuários ordenados por nome', async () => {
      const usersList = [makeUser(), makeUser({ id: 2, nome: 'Maria Silva' })];
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          orderBy: () => usersList,
        }),
      });

      const result = await repository.findAll();

      expect(result).toEqual(usersList);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo id', async () => {
      const user = makeUser();
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: () => [user],
          }),
        }),
      });

      const result = await repository.findOne(1);

      expect(result).toEqual([user]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('deve retornar um usuário pelo email', async () => {
      const user = makeUser();
      
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: () => [user],
          }),
        }),
      });

      const result = await repository.findByEmail('user@example.com');

      expect(result).toEqual([user]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const updatedUser = makeUser({ nome: 'Nome Atualizado' });
      const updateData = { nome: 'Nome Atualizado' };
      
      (db.update as jest.Mock).mockReturnValue({
        set: () => ({
          where: () => ({
            returning: () => [updatedUser],
          }),
        }),
      });

      const result = await repository.update(1, updateData);

      expect(result).toEqual([updatedUser]);
      expect(db.update).toHaveBeenCalledWith(users);
    });
  });

  describe('remove', () => {
    it('deve remover um usuário', async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: () => ({ success: true }),
      });

      const result = await repository.remove(1);

      expect(result).toEqual({ success: true });
      expect(db.delete).toHaveBeenCalledWith(users);
    });
  });

  describe('toggleActive', () => {
    it('deve alternar status ativo do usuário', async () => {
      const toggledUser = makeUser({ isActive: 0 });
      
      (db.update as jest.Mock).mockReturnValue({
        set: () => ({
          where: () => ({
            returning: () => [toggledUser],
          }),
        }),
      });

      const result = await repository.toggleActive(1, false);

      expect(result).toEqual([toggledUser]);
      expect(db.update).toHaveBeenCalledWith(users);
    });
  });
});