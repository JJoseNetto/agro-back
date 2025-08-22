import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  toggleActive: jest.fn(),
};

function makeUser(overrides = {}) {
  return {
    id: 1,
    email: 'user@example.com',
    nome: 'João Silva',
    role: 'user',
    isActive: 1,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const users = [
        makeUser(),
        makeUser({ id: 2, email: 'user2@example.com', nome: 'Maria Silva' })
      ];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const user = makeUser();
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(1);

      expect(result).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se usuário não existir', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('Usuário não encontrado')
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    const currentUserAdmin: CurrentUserDto = { id: 99, nome: 'Admin', email: 'admin@example.com', role: 'admin' };
    const currentUserUser: CurrentUserDto = { id: 1, nome: 'User', email: 'user@example.com', role: 'user' };

    it('deve atualizar um usuário', async () => {
      const updateDto: UpdateUserDto = {
        nome: 'Nome Atualizado',
        email: 'novo@example.com',
      };
      const updated = [makeUser({ nome: updateDto.nome, email: updateDto.email })];
      mockUsersService.update.mockResolvedValue(updated);

      const result = await controller.update(1, updateDto, currentUserAdmin);

      expect(result).toEqual(updated);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateDto, currentUserAdmin);
    });

    it('deve lançar erro se tentar usar email já existente', async () => {
      const updateDto: UpdateUserDto = {
        email: 'existe@example.com',
      };
      mockUsersService.update.mockRejectedValue(
        new ConflictException('Email já está em uso')
      );

      await expect(controller.update(1, updateDto, currentUserUser))
        .rejects.toThrow(ConflictException);

      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateDto, currentUserUser);
    });
  });

  describe('remove', () => {
    it('deve remover um usuário', async () => {
      mockUsersService.remove.mockResolvedValue({ success: true });

      const result = await controller.remove(1);

      expect(result).toEqual({ success: true });
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se usuário não existir', async () => {
      mockUsersService.remove.mockRejectedValue(
        new NotFoundException('Usuário não encontrado')
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockUsersService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('toggleActive', () => {
    it('deve alternar status ativo do usuário', async () => {
      const toggledUser = [makeUser({ isActive: 0 })];
      mockUsersService.toggleActive.mockResolvedValue(toggledUser);

      const result = await controller.toggleActive(1);

      expect(result).toEqual(toggledUser);
      expect(mockUsersService.toggleActive).toHaveBeenCalledWith(1);
    });
  });
});