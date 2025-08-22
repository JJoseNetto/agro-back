import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../users/users.repository';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockUsersRepository = {
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve lançar ConflictException se o email já estiver em uso', async () => {
      usersService.findByEmail.mockResolvedValue([{ 
        id: 1, 
        email: 'test@email.com',
        nome: 'User',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashed'
      }] as any);

      await expect(
        service.register({ email: 'test@email.com', password: '123456', nome: 'User' }),
      ).rejects.toThrow(ConflictException);

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@email.com');
    });

    it('deve criar um novo usuário quando o email não existir', async () => {
      usersService.findByEmail.mockResolvedValue([]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const mockUserCreated = { 
        id: 1, 
        email: 'new@email.com', 
        nome: 'User',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashedPassword'
      };
      usersRepository.create.mockResolvedValue(mockUserCreated as any);

      const result = await service.register({
        email: 'new@email.com',
        password: '123456',
        nome: 'User',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('new@email.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(result).toEqual(mockUserCreated);
    });
  });

  describe('validateUser', () => {
    it('deve retornar nulo quando o usuário não for encontrado', async () => {
      usersService.findByEmail.mockResolvedValue([]);

      const result = await service.validateUser('test@email.com', 'password');

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@email.com');
    });

    it('deve lançar UnauthorizedException quando o usuário estiver inativo', async () => {
      const mockUser = [{
        id: 1,
        email: 'test@email.com',
        password: 'hashedPassword',
        nome: 'Test User',
        role: 'user',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
      usersService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.validateUser('test@email.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@email.com');
    });

    it('deve retornar nulo quando a senha for inválida', async () => {
      const mockUser = [{
        id: 1,
        email: 'test@email.com',
        password: 'hashedPassword',
        nome: 'Test User',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@email.com', 'wrongPassword');

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    });

    it('deve retornar o usuário sem a senha quando a validação for bem-sucedida', async () => {
      const mockUser = [{
        id: 1,
        email: 'test@email.com',
        password: 'hashedPassword',
        nome: 'Test User',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@email.com', 'correctPassword');

      expect(result).toEqual({
        id: 1,
        email: 'test@email.com',
        nome: 'Test User',
        role: 'user',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword');
    });
  });

  describe('login', () => {
    it('deve retornar o token de acesso e os dados do usuário', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        nome: 'Test User',
        role: 'user',
      };
      const mockToken = 'mock.jwt.token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@email.com',
        sub: 1,
        nome: 'Test User',
        role: 'user',
      });
    });
  });
});