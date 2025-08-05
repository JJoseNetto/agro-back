import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorController } from './produtor.controller';
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';


const mockProdutorService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

function makeProdutor(overrides = {}) {
  return {
    id: 1,
    nome: 'João',
    cpfOuCnpj: '123',
    createdAt: new Date(),
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
      const created = makeProdutor({ nome: dto.nome, cpfOuCnpj: dto.cpfOuCnpj });
      mockProdutorService.create.mockResolvedValue(created);
      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(mockProdutorService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtores', async () => {
      const list = [makeProdutor(), makeProdutor({ id: 2, nome: 'Maria', cpfOuCnpj: '456' })];
      mockProdutorService.findAll.mockResolvedValue(list);
      const result = await controller.findAll();
      expect(result).toEqual(list);
      expect(mockProdutorService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um produtor pelo ID', async () => {
      const produtor = makeProdutor();
      mockProdutorService.findOne.mockResolvedValue(produtor);
      const result = await controller.findOne('1');
      expect(result).toEqual(produtor);
      expect(mockProdutorService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve atualizar um produtor', async () => {
      const updateDto: UpdateProdutorDto = {
        nome: 'João atualizado',
      };
      const updated = makeProdutor({ nome: updateDto.nome });
      mockProdutorService.update.mockResolvedValue(updated);
      const result = await controller.update('1', updateDto);
      expect(result).toEqual(updated);
      expect(mockProdutorService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover um produtor', async () => {
      mockProdutorService.remove.mockResolvedValue({ success: true });
      const result = await controller.remove('1');
      expect(result).toEqual({ success: true });
      expect(mockProdutorService.remove).toHaveBeenCalledWith(1);
    });
  });
});
