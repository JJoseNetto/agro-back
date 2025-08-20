import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

function makeUser(overrides = {}) {
  return {
    id: 1,
    email: 'user@example.com',
    password: '$2b$10$hashedpassword',
    nome: 'João Silva',
    role: 'user' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
    ...overrides,
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            toggleActive: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário com sucesso', async () => {
      const dto: CreateUserDto = {
        email: 'novo@example.com',
        password: 'senha123',
        nome: 'Novo Usuário',
        isActive: true,
      };
      const user = makeUser(dto);
      const userArray = [user];

      repository.findByEmail.mockResolvedValue([]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      repository.create.mockResolvedValue(userArray);

      const result = await service.create(dto);

      expect(result).toEqual(userArray);
      expect(repository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(repository.create).toHaveBeenCalledWith(dto, '$2b$10$hashedpassword');
    });

    it('deve lançar ConflictException se email já existe', async () => {
      const dto: CreateUserDto = {
        email: 'existe@example.com',
        password: 'senha123',
        nome: 'Usuário Teste',
      };
      const existingUser = makeUser();
      repository.findByEmail.mockResolvedValue([existingUser]);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const users = [makeUser(), makeUser({ id: 2 })];
      repository.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário existente', async () => {
      const user = makeUser();
      repository.findOne.mockResolvedValue([user]);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se usuário não existe', async () => {
      repository.findOne.mockResolvedValue([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuários por email', async () => {
      const user = makeUser();
      repository.findByEmail.mockResolvedValue([user]);

      const result = await service.findByEmail('user@example.com');

      expect(result).toEqual([user]);
      expect(repository.findByEmail).toHaveBeenCalledWith('user@example.com');
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      const dto: UpdateUserDto = { nome: 'Novo Nome' };
      const user = makeUser();
      const updatedUser = makeUser({ nome: 'Novo Nome' });

      repository.findOne.mockResolvedValue([user]);
      repository.findByEmail.mockResolvedValue([]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhash');
      repository.update.mockResolvedValue([updatedUser]);

      const result = await service.update(1, dto);

      expect(result).toEqual([updatedUser]);
      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it('deve lançar NotFoundException se usuário não existe', async () => {
      repository.findOne.mockResolvedValue([]);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ConflictException se email já está em uso', async () => {
      const user = makeUser();
      const otherUser = makeUser({ id: 2, email: 'existente@example.com' });

      repository.findOne.mockResolvedValue([user]);
      repository.findByEmail.mockResolvedValue([otherUser]);

      await expect(service.update(1, { email: 'existente@example.com' }))
        .rejects.toThrow(ConflictException);
    });

    it('deve atualizar a senha com hash', async () => {
      const dto: UpdateUserDto = { password: 'novaSenha123' };
      const user = makeUser();
      const updatedUser = makeUser({ password: '$2b$10$newhash' });

      repository.findOne.mockResolvedValue([user]);
      repository.findByEmail.mockResolvedValue([]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhash');
      repository.update.mockResolvedValue([updatedUser]);

      const result = await service.update(1, dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha123', 10);
      expect(result).toEqual([updatedUser]);
    });
  });

  describe('remove', () => {
    it('deve remover usuário', async () => {
      const user = makeUser();
      repository.findOne.mockResolvedValue([user]);

      const mockRowList = [] as any;
      repository.remove.mockResolvedValue(mockRowList); 
      const result = await service.remove(1);

      expect(result).toEqual(mockRowList);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se usuário não existe', async () => {
      repository.findOne.mockResolvedValue([]);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleActive', () => {
    it('deve desativar usuário ativo', async () => {
      const activeUser = makeUser({ isActive: true });
      const deactivatedUser = makeUser({ isActive: false });

      repository.findOne.mockResolvedValue([activeUser]);
      repository.update.mockResolvedValue([deactivatedUser]);

      const result = await service.toggleActive(1);

      expect(result).toEqual([deactivatedUser]);
      expect(repository.update).toHaveBeenCalledWith(1, { isActive: false });
    });

    it('deve ativar usuário inativo', async () => {
      const inactiveUser = makeUser({ isActive: false });
      const activatedUser = makeUser({ isActive: true });

      repository.findOne.mockResolvedValue([inactiveUser]);
      repository.update.mockResolvedValue([activatedUser]);

      const result = await service.toggleActive(1);

      expect(result).toEqual([activatedUser]);
      expect(repository.update).toHaveBeenCalledWith(1, { isActive: true });
    });

    it('deve lançar NotFoundException se usuário não existe', async () => {
      repository.findOne.mockResolvedValue([]);

      await expect(service.toggleActive(999)).rejects.toThrow(NotFoundException);
    });
  });
});