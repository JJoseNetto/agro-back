import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

function makeUser(overrides = {}) {
  return {
    id: 1,
    email: 'user@example.com',
    password: '$2b$10$hashedpassword',
    nome: 'João Silva',
    role: 'user' as const,
    isActive: 1,
    createdAt: new Date(),
    updateAt: null,
    ...overrides,
  };
}

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../db/connection', () => ({
  db: {
    select: (...args: any[]) => mockDb.select(...args),
    insert: (...args: any[]) => mockDb.insert(...args),
    update: (...args: any[]) => mockDb.update(...args),
    delete: (...args: any[]) => mockDb.delete(...args),
  },
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um usuário com senha hash', async () => {
      const dto = {
        email: 'novo@example.com',
        password: 'senha123',
        nome: 'Novo Usuário',
        isActive: true,
      };

      // Mock para verificar email não existe
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => [],
          }),
        }),
      });

      // Mock do hash da senha
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');

      // Mock da inserção
      const createdUser = makeUser({ ...dto, password: undefined });
      mockDb.insert.mockReturnValueOnce({
        values: () => ({
          returning: () => [createdUser],
        }),
      });

      const result = await service.create(dto);
      expect(result).toEqual([createdUser]);
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
    });

    it('deve lançar erro se email já existir', async () => {
      const dto = {
        email: 'existe@example.com',
        password: 'senha123',
        nome: 'Usuário Teste',
      };

      // Mock para email já existe
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => [makeUser({ email: dto.email })],
          }),
        }),
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow('Email já está em uso');
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários ordenados por nome', async () => {
      const users = [
        makeUser({ nome: 'Ana' }),
        makeUser({ id: 2, nome: 'Bruno', email: 'bruno@example.com' })
      ];

      mockDb.select.mockReturnValueOnce({
        from: () => ({
          orderBy: () => users,
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const user = makeUser();
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [user],
        }),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('deve lançar erro se usuário não existir', async () => {
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [],
        }),
      });

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário pelo email', async () => {
      const user = makeUser();
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => [user],
          }),
        }),
      });

      const result = await service.findByEmail('user@example.com');
      expect(result).toEqual([user]);
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const updateDto = {
        nome: 'Nome Atualizado',
        email: 'novo@example.com',
      };

      // Mock findOne para verificar se usuário existe
      const existingUser = makeUser();
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [existingUser],
        }),
      });

      // Mock para verificar email não está em uso
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => [],
          }),
        }),
      });

      // Mock da atualização
      const updatedUser = makeUser({ ...updateDto });
      mockDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => [updatedUser],
          }),
        }),
      });

      const result = await service.update(1, updateDto);
      expect(result).toEqual([updatedUser]);
    });

    it('deve fazer hash da senha ao atualizar', async () => {
      const updateDto = {
        password: 'novasenha123',
      };

      // Mock findOne
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [makeUser()],
        }),
      });

      // Mock hash
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhashedpassword');

      // Mock update
      mockDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => [makeUser()],
          }),
        }),
      });

      await service.update(1, updateDto);
      expect(bcrypt.hash).toHaveBeenCalledWith('novasenha123', 10);
    });

    it('deve lançar erro se email já estiver em uso', async () => {
      const updateDto = {
        email: 'existe@example.com',
      };

      // Mock findOne
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [makeUser()],
        }),
      });

      // Mock email já existe para outro usuário
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => [makeUser({ id: 2, email: updateDto.email })],
          }),
        }),
      });

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
      await expect(service.update(1, updateDto)).rejects.toThrow('Email já está em uso');
    });
  });

  describe('remove', () => {
    it('deve remover um usuário', async () => {
      // Mock findOne
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [makeUser()],
        }),
      });

      // Mock delete
      mockDb.delete.mockReturnValueOnce({
        where: () => ({ success: true }),
      });

      const result = await service.remove(1);
      expect(result).toEqual({ success: true });
    });

    it('deve lançar erro se usuário não existir', async () => {
      // Mock findOne para usuário não existe
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [],
        }),
      });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleActive', () => {
    it('deve ativar usuário inativo', async () => {
      const inactiveUser = makeUser({ isActive: 0 });

      // Mock findOne
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [inactiveUser],
        }),
      });

      // Mock update
      const activatedUser = makeUser({ isActive: 1 });
      mockDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => [activatedUser],
          }),
        }),
      });

      const result = await service.toggleActive(1);
      expect(result).toEqual([activatedUser]);
    });

    it('deve desativar usuário ativo', async () => {
      const activeUser = makeUser({ isActive: 1 });

      // Mock findOne
      mockDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => [activeUser],
        }),
      });

      // Mock update
      const deactivatedUser = makeUser({ isActive: 0 });
      mockDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => [deactivatedUser],
          }),
        }),
      });

      const result = await service.toggleActive(1);
      expect(result).toEqual([deactivatedUser]);
    });
  });
});
