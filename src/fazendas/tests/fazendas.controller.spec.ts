import { Test, TestingModule } from '@nestjs/testing';
import { FazendasController } from '../fazendas.controller';
import { FazendasService } from '../fazendas.service';
import { CreateFazendaDto } from '../dto/create-fazenda.dto';
import { UpdateFazendaDto } from '../dto/update-fazenda.dto';

const mockFazendasService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

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

function makeUser(overrides = {}) {
  return {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

describe('FazendasController', () => {
  let controller: FazendasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FazendasController],
      providers: [
        {
          provide: FazendasService,
          useValue: mockFazendasService,
        },
      ],
    }).compile();

    controller = module.get<FazendasController>(FazendasController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma fazenda', async () => {
      const dto: CreateFazendaDto = {
        nome: 'Fazenda Nova',
        cidade: 'Campinas',
        estado: 'SP',
        areaTotal: '150.0',
        areaAgricultavel: '120.0',
        areaVegetacao: '30.0',
        produtorId: 1,
      };
      const user = makeUser();
      const created = makeFazenda({ ...dto });
      mockFazendasService.create.mockResolvedValue(created);
      
      const result = await controller.create(dto, user);
      
      expect(result).toEqual(created);
      expect(mockFazendasService.create).toHaveBeenCalledWith(dto, user);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as fazendas', async () => {
      const user = makeUser();
      const list = [makeFazenda(), makeFazenda({ id: 2, nome: 'Fazenda Santa Maria' })];
      mockFazendasService.findAll.mockResolvedValue(list);
      
      const result = await controller.findAll(user);
      
      expect(result).toEqual(list);
      expect(mockFazendasService.findAll).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma fazenda pelo ID', async () => {
      const user = makeUser();
      const fazenda = makeFazenda();
      mockFazendasService.findOne.mockResolvedValue(fazenda);
      
      const result = await controller.findOne('1', user);
      
      expect(result).toEqual(fazenda);
      expect(mockFazendasService.findOne).toHaveBeenCalledWith(1, user);
    });
  });

  describe('update', () => {
    it('deve atualizar uma fazenda', async () => {
      const user = makeUser();
      const updateDto: UpdateFazendaDto = {
        nome: 'Fazenda Atualizada',
        areaTotal: '200.0',
      };
      const updated = makeFazenda({ nome: updateDto.nome, areaTotal: updateDto.areaTotal });
      mockFazendasService.update.mockResolvedValue(updated);
      
      const result = await controller.update('1', updateDto, user);
      
      expect(result).toEqual(updated);
      expect(mockFazendasService.update).toHaveBeenCalledWith(1, updateDto, user);
    });
  });

  describe('remove', () => {
    it('deve remover uma fazenda', async () => {
      const user = makeUser();
      mockFazendasService.remove.mockResolvedValue({ message: 'Fazenda deletada com sucesso' });
      
      const result = await controller.remove('1', user);
      
      expect(result).toEqual({ message: 'Fazenda deletada com sucesso' });
      expect(mockFazendasService.remove).toHaveBeenCalledWith(1, user);
    });
  });
});