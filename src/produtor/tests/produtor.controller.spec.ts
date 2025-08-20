import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorController } from '../produtor.controller';
import { ProdutorService } from '../produtor.service';
import { CreateProdutorDto } from '../dto/create-produtor.dto';
import { UpdateProdutorDto } from '../dto/update-produtor.dto';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

const mockProdutorService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  removeByUser: jest.fn(),
};

function makeProdutor(overrides = {}) {
  return {
    id: 1,
    nome: 'João',
    cpfOuCnpj: '123',
    createdAt: new Date(),
    userId: 1,
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

describe('ProdutorController', () => {
  let controller: ProdutorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutorController],
      providers: [
        {
          provide: ProdutorService,
          useValue: mockProdutorService,
        },
      ],
    }).compile();

    controller = module.get<ProdutorController>(ProdutorController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um produtor', async () => {
      const dto: CreateProdutorDto = {
        nome: 'João da Silva',
        cpfOuCnpj: '123.456.789-00',
      };
      const user = makeUser();
      const created = makeProdutor({ nome: dto.nome, cpfOuCnpj: dto.cpfOuCnpj, userId: user.id });
      mockProdutorService.create.mockResolvedValue(created);

      const result = await controller.create(dto, user);

      expect(result).toEqual(created);
      expect(mockProdutorService.create).toHaveBeenCalledWith(dto, user.id);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtores do usuário', async () => {
      const user = makeUser();
      const list = [makeProdutor({ userId: 1 })];
      mockProdutorService.findAll.mockResolvedValue(list);

      const result = await controller.findAll(user);

      expect(result).toEqual(list);
      expect(mockProdutorService.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um produtor pelo ID', async () => {
      const user = makeUser();
      const produtor = makeProdutor({ userId: 1 });
      mockProdutorService.findOne.mockResolvedValue(produtor);

      const result = await controller.findOne('1', user);

      expect(result).toEqual(produtor);
      expect(mockProdutorService.findOne).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('update', () => {
    it('deve atualizar um produtor', async () => {
      const updateDto: UpdateProdutorDto = {
        nome: 'João atualizado',
      };
      const user = makeUser();
      const updated = makeProdutor({ nome: updateDto.nome, userId: 1 });
      mockProdutorService.update.mockResolvedValue(updated);

      const result = await controller.update('1', updateDto, user);

      expect(result).toEqual(updated);
      expect(mockProdutorService.update).toHaveBeenCalledWith(1, 1, updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover um produtor', async () => {
      const user = makeUser();
      mockProdutorService.removeByUser.mockResolvedValue({ success: true });

      const result = await controller.remove('1', user);

      expect(result).toEqual({ success: true });
      expect(mockProdutorService.removeByUser).toHaveBeenCalledWith(1, 1);
    });
  });
});
