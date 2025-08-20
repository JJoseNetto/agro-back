import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
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
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('deve retornar nulo quando o usuário não for encontrado', async () => {
      mockUsersService.findByEmail.mockResolvedValue([]);

      const result = await service.validateUser('test@email.com', 'password');

      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@email.com');
    });

    it('deve lançar UnauthorizedException quando o usuário estiver inativo', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        password: 'hashedPassword',
        isActive: false,
      };
      mockUsersService.findByEmail.mockResolvedValue([mockUser]);

      await expect(service.validateUser('test@email.com', 'password')).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@email.com');
    });

    it('deve retornar nulo quando a senha for inválida', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        password: 'hashedPassword',
        isActive: 1,
      };
      mockUsersService.findByEmail.mockResolvedValue([mockUser]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@email.com', 'wrongPassword');

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    });

    it('deve retornar o usuário sem a senha quando a validação for bem-sucedida', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        password: 'hashedPassword',
        nome: 'Test User',
        isActive: 1,
      };
      mockUsersService.findByEmail.mockResolvedValue([mockUser]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@email.com', 'correctPassword');

      expect(result).toEqual({
        id: 1,
        email: 'test@email.com',
        nome: 'Test User',
        isActive: 1,
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
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: 1,
          email: 'test@email.com',
          nome: 'Test User',
          role: 'user',
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@email.com',
        sub: 1,
        nome: 'Test User',
        role: 'user',
      });
    });
  });
});
