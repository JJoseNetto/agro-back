import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

const mockAuthService = {
  login: jest.fn(),
};

function makeAuthResponse(overrides = {}) {
  return {
    access_token: 'jwt-token',
    user: {
      id: 1,
      nome: 'Test User',
      email: 'test@example.com',
      role: 'user',
    },
    ...overrides,
  };
}

function makeUser(overrides = {}) {
  return {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deve fazer login do usuário com sucesso', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = makeUser();
      const authResponse = makeAuthResponse();
      const req = { user };

      mockAuthService.login.mockResolvedValue(authResponse);

      const result = await controller.login(req, loginDto);

      expect(result).toEqual(authResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('deve fazer login com usuário admin', async () => {
      const loginDto: LoginDto = {
        email: 'admin@example.com',
        password: 'password123',
      };
      const user = makeUser({
        email: 'admin@example.com',
        role: 'admin'
      });
      const authResponse = makeAuthResponse({
        user: {
          id: 1,
          nome: 'Test User',
          email: 'admin@example.com',
          role: 'admin',
        }
      });
      const req = { user };

      mockAuthService.login.mockResolvedValue(authResponse);

      const result = await controller.login(req, loginDto);

      expect(result).toEqual(authResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('deve retornar token e dados do usuário', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = makeUser();
      const authResponse = makeAuthResponse();
      const req = { user };

      mockAuthService.login.mockResolvedValue(authResponse);

      const result = await controller.login(req, loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user).toEqual(authResponse.user);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('deve chamar o serviço de login com o usuário da requisição', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = makeUser({ id: 2, email: 'outro@example.com' });
      const authResponse = makeAuthResponse();
      const req = { user };

      mockAuthService.login.mockResolvedValue(authResponse);

      await controller.login(req, loginDto);

      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('deve retornar a resposta do serviço de login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = makeUser();
      const authResponse = makeAuthResponse({
        access_token: 'custom-token',
        user: { ...user, role: 'admin' }
      });
      const req = { user };

      mockAuthService.login.mockResolvedValue(authResponse);

      const result = await controller.login(req, loginDto);

      expect(result).toBe(authResponse);
    });

    it('deve lidar com diferentes tipos de usuário', async () => {
      const loginDto: LoginDto = {
        email: 'manager@example.com',
        password: 'password123',
      };
      const user = makeUser({
        id: 3,
        nome: 'Manager User',
        email: 'manager@example.com',
        role: 'manager'
      });
      const authResponse = makeAuthResponse({
        user: { ...user }
      });
      const req = { user };

      mockAuthService.login.mockResolvedValue(authResponse);

      const result = await controller.login(req, loginDto);

      expect(result).toEqual(authResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });
});