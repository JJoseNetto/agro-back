import { Test, TestingModule } from '@nestjs/testing';
import { SafrasController } from './safras.controller';
import { SafrasService } from './safras.service';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';

const mockSafrasService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

function makeSafra(overrides = {}) {
  return {
    id: 1,
    ano: 2025,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('SafrasController', () => {
  let controller: SafrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafrasController],
      providers: [
        {
          provide: SafrasService,
          useValue: mockSafrasService,
        },
      ],
    }).compile();

    controller = module.get<SafrasController>(SafrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma safra', async () => {
      const dto: CreateSafraDto = {
        ano: 2025,
      };
      const created = makeSafra({ ano: dto.ano });
      mockSafrasService.create.mockResolvedValue(created);
      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(mockSafrasService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as safras', async () => {
      const list = [makeSafra(), makeSafra({ id: 2, ano: 2024 })];
      mockSafrasService.findAll.mockResolvedValue(list);
      const result = await controller.findAll();
      expect(result).toEqual(list);
      expect(mockSafrasService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma safra pelo ID', async () => {
      const safra = makeSafra();
      mockSafrasService.findOne.mockResolvedValue(safra);
      const result = await controller.findOne('1');
      expect(result).toEqual(safra);
      expect(mockSafrasService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve atualizar uma safra', async () => {
      const updateDto: UpdateSafraDto = {
        ano: 2026,
      };
      const updated = makeSafra({ ano: updateDto.ano });
      mockSafrasService.update.mockResolvedValue(updated);
      const result = await controller.update('1', updateDto);
      expect(result).toEqual(updated);
      expect(mockSafrasService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover uma safra', async () => {
      mockSafrasService.remove.mockResolvedValue({ success: true });
      const result = await controller.remove('1');
      expect(result).toEqual({ success: true });
      expect(mockSafrasService.remove).toHaveBeenCalledWith(1);
    });
  });
});
