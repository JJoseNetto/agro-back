import { Test, TestingModule } from '@nestjs/testing';
import { CulturasPlantadasService } from '../culturas-plantadas.service';
import { CulturasPlantadasRepository } from '../culturas-plantadas.repository';
import { CreateCulturaPlantadaDto } from '../dto/create-cultura-plantada.dto';
import { UpdateCulturaPlantadaDto } from '../dto/update-cultura-plantada.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

function makeCulturaPlantada(overrides = {}) {
  return {
    id: 1,
    nome: 'Soja',
    fazendaId: 1,
    safraId: 1,
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

describe('CulturasPlantadasService', () => {
  let service: CulturasPlantadasService;
  let repository: jest.Mocked<CulturasPlantadasRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturasPlantadasService,
        {
          provide: CulturasPlantadasRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            validateCulturasPlantadasOwnership: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CulturasPlantadasService>(CulturasPlantadasService);
    repository = module.get(CulturasPlantadasRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma cultura plantada com sucesso', async () => {
      const dto: CreateCulturaPlantadaDto = {
        nome: 'Soja',
        fazendaId: 1,
        safraId: 1,
      };
      const user = makeUser();
      const cultura = makeCulturaPlantada(dto);

      repository.validateCulturasPlantadasOwnership.mockResolvedValue([{}] as any);
      repository.create.mockResolvedValue([cultura]);

      const result = await service.create(dto, user);

      expect(result).toEqual([cultura]);
      expect(repository.validateCulturasPlantadasOwnership).toHaveBeenCalledWith(dto.fazendaId, user.id);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });

    it('deve lançar ForbiddenException se não tiver permissão', async () => {
      const dto: CreateCulturaPlantadaDto = {
        nome: 'Soja',
        fazendaId: 1,
        safraId: 1,
      };
      const user = makeUser();

      repository.validateCulturasPlantadasOwnership.mockResolvedValue([]);

      await expect(service.create(dto, user)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as culturas plantadas do usuário', async () => {
      const user = makeUser();
      const culturas = [makeCulturaPlantada(), makeCulturaPlantada({ id: 2 })];
      repository.findAll.mockResolvedValue(culturas);

      const result = await service.findAll(user);

      expect(result).toEqual(culturas);
      expect(repository.findAll).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma cultura plantada existente', async () => {
      const cultura = makeCulturaPlantada();
      repository.findOne.mockResolvedValue(cultura);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(cultura);
      expect(repository.findOne).toHaveBeenCalledWith(1, 1);
    });

    it('deve lançar NotFoundException se cultura não existe', async () => {
        repository.findOne.mockResolvedValue(null as any);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma cultura plantada com sucesso', async () => {
      const dto: UpdateCulturaPlantadaDto = { nome: 'Algodão' };
      const user = makeUser();
      const culturaExistente = makeCulturaPlantada();
      const culturaAtualizada = makeCulturaPlantada({ nome: 'Algodão' });

      repository.findOne.mockResolvedValue(culturaExistente);
      repository.validateCulturasPlantadasOwnership.mockResolvedValue([{}] as any);
      repository.update.mockResolvedValue([culturaAtualizada]);

      const result = await service.update(1, dto, user);

      expect(result).toEqual([culturaAtualizada]);
      expect(repository.findOne).toHaveBeenCalledWith(1, user.id);
      expect(repository.validateCulturasPlantadasOwnership).toHaveBeenCalledWith(culturaExistente.fazendaId, user.id);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('deve remover uma cultura plantada', async () => {
      const user = makeUser();
      const cultura = makeCulturaPlantada();
      const mockRowList = [] as any;

      repository.findOne.mockResolvedValue(cultura);
      repository.remove.mockResolvedValue(mockRowList);

      const result = await service.remove(1, user.id);

      expect(result).toEqual({ message: 'Cultura plantada removida com sucesso' });
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});