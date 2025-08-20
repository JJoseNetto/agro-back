import { Test, TestingModule } from '@nestjs/testing';
import { FazendasService } from '../fazendas.service';
import { FazendasRepository } from '../fazendas.repository';
import { CreateFazendaDto } from '../dto/create-fazenda.dto';
import { UpdateFazendaDto } from '../dto/update-fazenda.dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

function makeFazendaJoin(overrides = {}) {
  return {
    produtores: {
      id: 1,
      nome: 'Produtor Teste',
      cpfOuCnpj: '123.456.789-00',
      userId: 1,
      createdAt: new Date(),
    },
    fazendas: {
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
    }
  };
}

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

function makeUser(overrides = {}): CurrentUserDto {
  return {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

describe('FazendasService', () => {
  let service: FazendasService;
  let repository: jest.Mocked<FazendasRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FazendasService,
        {
          provide: FazendasRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            validateFazendaOwnership: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FazendasService>(FazendasService);
    repository = module.get(FazendasRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma fazenda com áreas válidas', async () => {
      const dto: CreateFazendaDto = {
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: '100',
        areaAgricultavel: '70',
        areaVegetacao: '30',
        produtorId: 1,
      };
      const user = makeUser();
      const fazenda = makeFazenda(dto);

      repository.validateFazendaOwnership.mockResolvedValue([{}] as any);
      repository.create.mockResolvedValue([fazenda]);

      const result = await service.create(dto, user);

      expect(result).toEqual([fazenda]);
      expect(repository.validateFazendaOwnership).toHaveBeenCalledWith(dto.produtorId, user.id);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });

    it('deve lançar BadRequestException se soma das áreas ultrapassar área total', async () => {
      const dto: CreateFazendaDto = {
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: '100',
        areaAgricultavel: '80',
        areaVegetacao: '30',
        produtorId: 1,
      };
      const user = makeUser();

      await expect(service.create(dto, user)).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException se não tiver permissão', async () => {
      const dto: CreateFazendaDto = {
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: '100',
        areaAgricultavel: '70',
        areaVegetacao: '30',
        produtorId: 1,
      };
      const user = makeUser();

      repository.validateFazendaOwnership.mockResolvedValue([]);

      await expect(service.create(dto, user)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as fazendas do usuário', async () => {
      const user = makeUser();
      const fazendasJoin = [makeFazendaJoin(), makeFazendaJoin({ fazendas: { id: 2, nome: 'Fazenda 2' } })];
      repository.findAll.mockResolvedValue(fazendasJoin);

      const result = await service.findAll(user);

      expect(result).toEqual(fazendasJoin);
      expect(repository.findAll).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma fazenda existente', async () => {
      const user = makeUser();
      const fazendaJoin = makeFazendaJoin();
      repository.findOne.mockResolvedValue(fazendaJoin);

      const result = await service.findOne(1, user);

      expect(result).toEqual(fazendaJoin);
      expect(repository.findOne).toHaveBeenCalledWith(1, user.id);
    });

    it('deve lançar NotFoundException se fazenda não existe', async () => {
      const user = makeUser();
      repository.findOne.mockResolvedValue(null as any);

      await expect(service.findOne(999, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma fazenda com áreas válidas', async () => {
      const dto: UpdateFazendaDto = { nome: 'Fazenda Atualizada', areaTotal: '150', areaAgricultavel: '100', areaVegetacao: '50' };
      const user = makeUser();
      const fazendaJoin = makeFazendaJoin();
      const fazendaAtualizada = makeFazenda({ nome: 'Fazenda Atualizada' });

      repository.findOne.mockResolvedValue(fazendaJoin);
      repository.validateFazendaOwnership.mockResolvedValue([{}] as any);
      repository.update.mockResolvedValue([fazendaAtualizada]);

      const result = await service.update(1, dto, user);

      expect(result).toEqual(fazendaAtualizada);
      expect(repository.findOne).toHaveBeenCalledWith(1, user.id);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve atualizar uma fazenda quando produtorId for informado', async () => {
      const dto: UpdateFazendaDto = { nome: 'Fazenda X', produtorId: 1 };
      const user = makeUser();
      const fazendaJoin = makeFazendaJoin();
      const fazendaAtualizada = makeFazenda({ nome: 'Fazenda X' });

      repository.findOne.mockResolvedValue(fazendaJoin);
      repository.validateFazendaOwnership.mockResolvedValue([{}] as any);
      repository.update.mockResolvedValue([fazendaAtualizada]);

      const result = await service.update(1, dto, user);

      expect(result).toEqual(fazendaAtualizada);
      expect(repository.validateFazendaOwnership).toHaveBeenCalledWith(1, user.id);
    });
  });

  describe('remove', () => {
    it('deve remover uma fazenda', async () => {
      const user = makeUser();
      const fazendaJoin = makeFazendaJoin();
      const mockRowList = [] as any;

      repository.findOne.mockResolvedValue(fazendaJoin);
      repository.remove.mockResolvedValue(mockRowList);

      const result = await service.remove(1, user);

      expect(result).toEqual({ message: 'Fazenda deletada com sucesso' });
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});