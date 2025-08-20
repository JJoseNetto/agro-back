import { Test, TestingModule } from '@nestjs/testing';
import { CulturasPlantadasController } from '../culturas-plantadas.controller';
import { CulturasPlantadasService } from '../culturas-plantadas.service';
import { CreateCulturaPlantadaDto } from '../dto/create-cultura-plantada.dto';
import { UpdateCulturaPlantadaDto } from '../dto/update-cultura-plantada.dto';

const mockCulturasPlantadasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

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

function makeUser(overrides = {}) {
    return {
        id: 1,
        nome: 'Test User',
        email: 'test@example.com',
        role: 'user',
        ...overrides,
    };
}

describe('CulturasPlantadasController', () => {
    let controller: CulturasPlantadasController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CulturasPlantadasController],
            providers: [
                {
                    provide: CulturasPlantadasService,
                    useValue: mockCulturasPlantadasService,
                },
            ],
        }).compile();

        controller = module.get<CulturasPlantadasController>(CulturasPlantadasController);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('deve criar uma cultura plantada', async () => {
            const dto: CreateCulturaPlantadaDto = {
                nome: 'Milho',
                fazendaId: 1,
                safraId: 1,
            };
            const user = makeUser();
            const created = makeCulturaPlantada({ ...dto });
            mockCulturasPlantadasService.create.mockResolvedValue(created);
            
            const result = await controller.create(dto, user);
            
            expect(result).toEqual(created);
            expect(mockCulturasPlantadasService.create).toHaveBeenCalledWith(dto, user);
        });
    });

    describe('findAll', () => {
        it('deve retornar todas as culturas plantadas', async () => {
            const user = makeUser();
            const list = [makeCulturaPlantada(), makeCulturaPlantada({ id: 2, nome: 'Café' })];
            mockCulturasPlantadasService.findAll.mockResolvedValue(list);
            
            const result = await controller.findAll(user);
            
            expect(result).toEqual(list);
            expect(mockCulturasPlantadasService.findAll).toHaveBeenCalledWith(user);
        });
    });

    describe('findOne', () => {
        it('deve retornar uma cultura plantada pelo ID', async () => {
            const user = makeUser();
            const cultura = makeCulturaPlantada();
            mockCulturasPlantadasService.findOne.mockResolvedValue(cultura);
            
            const result = await controller.findOne('1', user);
            
            expect(result).toEqual(cultura);
            expect(mockCulturasPlantadasService.findOne).toHaveBeenCalledWith(1, user.id);
        });
    });

    describe('update', () => {
        it('deve atualizar uma cultura plantada', async () => {
            const user = makeUser();
            const updateDto: UpdateCulturaPlantadaDto = {
                nome: 'Algodão',
                safraId: 2,
            };
            const updated = makeCulturaPlantada({ nome: updateDto.nome, safraId: updateDto.safraId });
            mockCulturasPlantadasService.update.mockResolvedValue(updated);
            
            const result = await controller.update('1', updateDto, user);
            
            expect(result).toEqual(updated);
            expect(mockCulturasPlantadasService.update).toHaveBeenCalledWith(1, updateDto, user);
        });
    });

    describe('remove', () => {
        it('deve remover uma cultura plantada', async () => {
            const user = makeUser();
            mockCulturasPlantadasService.remove.mockResolvedValue({ message: 'Cultura plantada removida com sucesso' });
            
            const result = await controller.remove('1', user);
            
            expect(result).toEqual({ message: 'Cultura plantada removida com sucesso' });
            expect(mockCulturasPlantadasService.remove).toHaveBeenCalledWith(1, 1);
        });
    });
});