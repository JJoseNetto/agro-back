import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorService } from '../produtor.service';
import { ProdutorRepository } from '../produtor.repository';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProdutorDto } from '../dto/create-produtor.dto';
import { UpdateProdutorDto } from '../dto/update-produtor.dto';

function makeProdutor(overrides = {}) {
  return {
    id: 1,
    nome: 'João da Silva',
    cpfOuCnpj: '123.456.789-00',
    createdAt: new Date(),
    userId: 1,
    ...overrides,
  };
}

describe('ProdutorService', () => {
  let service: ProdutorService;
  let repository: jest.Mocked<ProdutorRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutorService,
        {
          provide: ProdutorRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByCpfProdutor: jest.fn(),
            validateProdutorOwnership: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutorService>(ProdutorService);
    repository = module.get(ProdutorRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um produtor com sucesso', async () => {
      const dto: CreateProdutorDto = {
        nome: 'João da Silva',
        cpfOuCnpj: '123.456.789-00',
        userId: 1,
      };
      const produtor = makeProdutor(dto);

      repository.findByCpfProdutor.mockResolvedValue([]);
      repository.create.mockResolvedValue([produtor]);

      const result = await service.create(dto, 1);

      expect(result).toEqual(produtor);
      expect(repository.findByCpfProdutor).toHaveBeenCalledWith(dto.cpfOuCnpj);
      expect(repository.create).toHaveBeenCalledWith(dto, 1);
    });

    it('deve lançar ConflictException se CPF/CNPJ já existe', async () => {
      const dto: CreateProdutorDto = {
        nome: 'João da Silva',
        cpfOuCnpj: '123.456.789-00',
        userId: 1,
      };
      repository.findByCpfProdutor.mockResolvedValue([makeProdutor()]);

      await expect(service.create(dto, 1)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtores do usuário', async () => {
      const produtores = [makeProdutor(), makeProdutor({ id: 2 })];
      repository.findAll.mockResolvedValue(produtores);

      const result = await service.findAll(1);

      expect(result).toEqual(produtores);
      expect(repository.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um produtor existente', async () => {
      const produtor = makeProdutor();
      repository.findOne.mockResolvedValue([produtor]);

      const result = await service.findOne(1, 1);

      expect(result).toEqual([produtor]);
      expect(repository.findOne).toHaveBeenCalledWith(1, 1);
    });

    it('deve lançar NotFoundException se produtor não existe', async () => {
      repository.findOne.mockResolvedValue([]);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um produtor com sucesso', async () => {
      const dto: UpdateProdutorDto = { nome: 'Novo Nome' };
      const produtor = makeProdutor({ nome: 'Antigo' });
      const updated = { ...produtor, ...dto };

      repository.findOne.mockResolvedValue([produtor]);
      repository.validateProdutorOwnership.mockResolvedValue(true);
      repository.update.mockResolvedValue([updated]);

      const result = await service.update(1, 1, dto);

      expect(result).toEqual(updated);
      expect(repository.findOne).toHaveBeenCalledWith(1, 1);
      expect(repository.validateProdutorOwnership).toHaveBeenCalledWith(1, 1);
      expect(repository.update).toHaveBeenCalledWith(1, 1, dto);
    });

    it('deve lançar NotFoundException se produtor não existe', async () => {
      repository.findOne.mockResolvedValue([]);

      await expect(service.update(999, 1, {})).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException se não tiver permissão', async () => {
      repository.findOne.mockResolvedValue([makeProdutor()]);
      repository.validateProdutorOwnership.mockResolvedValue(false);

      await expect(service.update(1, 2, {})).rejects.toThrow(ForbiddenException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException se CPF/CNPJ já existe', async () => {
      const dto: UpdateProdutorDto = { cpfOuCnpj: '123.456.789-00' };
      repository.findOne.mockResolvedValue([makeProdutor()]);
      repository.validateProdutorOwnership.mockResolvedValue(true);

      service.findByCpfProdutor = jest.fn().mockResolvedValue([makeProdutor()]);

      await expect(service.update(1, 1, dto)).rejects.toThrow(ConflictException);

      expect(repository.update).not.toHaveBeenCalled();
    });

  });

  describe('removeByUser', () => {
    it('deve remover produtor do usuário', async () => {
      const produtor = makeProdutor();
      repository.findOne.mockResolvedValue([produtor]);
      repository.remove.mockResolvedValue([]);

      const result = await service.removeByUser(1, 1);

      expect(result).toStrictEqual([]);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se produtor não existe', async () => {
      repository.findOne.mockResolvedValue([]);

      await expect(service.removeByUser(999, 1)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });

  describe('findByCpfProdutor', () => {
    it('deve retornar produtores por cpfOuCnpj', async () => {
      const produtor = makeProdutor();
      repository.findByCpfProdutor.mockResolvedValue([produtor]);

      const result = await service.findByCpfProdutor('123.456.789-00');

      expect(result).toEqual([produtor]);
      expect(repository.findByCpfProdutor).toHaveBeenCalledWith('123.456.789-00');
    });
  });
});
