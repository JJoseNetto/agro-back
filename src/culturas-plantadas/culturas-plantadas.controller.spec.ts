import { Test, TestingModule } from '@nestjs/testing';
import { CulturasPlantadasController } from './culturas-plantadas.controller';
import { CulturasPlantadasService } from './culturas-plantadas.service';
import { CreateCulturaPlantadaDto } from './dto/create-cultura-plantada.dto';
import { UpdateCulturaPlantadaDto } from './dto/update-cultura-plantada.dto';

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
            const created = makeCulturaPlantada({ ...dto });
            mockCulturasPlantadasService.create.mockResolvedValue(created);
            const result = await controller.create(dto);
            expect(result).toEqual(created);
            expect(mockCulturasPlantadasService.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('deve retornar todas as culturas plantadas', async () => {
            const list = [makeCulturaPlantada(), makeCulturaPlantada({ id: 2, nome: 'Café' })];
            mockCulturasPlantadasService.findAll.mockResolvedValue(list);
            const result = await controller.findAll();
            expect(result).toEqual(list);
            expect(mockCulturasPlantadasService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('deve retornar uma cultura plantada pelo ID', async () => {
            const cultura = makeCulturaPlantada();
            mockCulturasPlantadasService.findOne.mockResolvedValue(cultura);
            const result = await controller.findOne('1');
            expect(result).toEqual(cultura);
            expect(mockCulturasPlantadasService.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('deve atualizar uma cultura plantada', async () => {
            const updateDto: UpdateCulturaPlantadaDto = {
                nome: 'Algodão',
                safraId: 2,
            };
            const updated = makeCulturaPlantada({ nome: updateDto.nome, safraId: updateDto.safraId });
            mockCulturasPlantadasService.update.mockResolvedValue(updated);
            const result = await controller.update('1', updateDto);
            expect(result).toEqual(updated);
            expect(mockCulturasPlantadasService.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('remove', () => {
        it('deve remover uma cultura plantada', async () => {
            mockCulturasPlantadasService.remove.mockResolvedValue({ success: true });
            const result = await controller.remove('1');
            expect(result).toEqual({ success: true });
            expect(mockCulturasPlantadasService.remove).toHaveBeenCalledWith(1);
        });
    });
});