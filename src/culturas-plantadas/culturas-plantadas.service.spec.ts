import { Test, TestingModule } from '@nestjs/testing';
import { CulturasPlantadasService } from './culturas-plantadas.service';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

jest.mock('../db/connection', () => ({
    db: {
        select: (...args: any[]) => mockDb.select(...args),
        insert: (...args: any[]) => mockDb.insert(...args),
        update: (...args: any[]) => mockDb.update(...args),
        delete: (...args: any[]) => mockDb.delete(...args),
    },
}));

describe('CulturasPlantadasService', () => {
    let service: CulturasPlantadasService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CulturasPlantadasService],
        }).compile();

        service = module.get<CulturasPlantadasService>(CulturasPlantadasService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deve criar uma cultura plantada', async () => {
            const dto = {
                nome: 'Milho',
                fazendaId: 1,
                safraId: 1,
            };

            const cultura = makeCulturaPlantada({ ...dto });
            mockDb.insert.mockReturnValueOnce({
                values: () => ({
                    returning: () => [cultura],
                }),
            });

            const result = await service.create(dto);
            expect(result).toEqual([cultura]);
        });
    });

    describe('findAll', () => {
        it('deve retornar todas as culturas plantadas ordenadas por nome', async () => {
            const culturas = [
                makeCulturaPlantada({ nome: 'Café' }),
                makeCulturaPlantada({ id: 2, nome: 'Soja' })
            ];
            mockDb.select.mockReturnValueOnce({
                from: () => ({
                    orderBy: () => culturas,
                }),
            });

            const result = await service.findAll();
            expect(result).toEqual(culturas);
        });
    });

    describe('findOne', () => {
        it('deve retornar uma cultura plantada pelo ID', async () => {
            const cultura = makeCulturaPlantada();
            mockDb.select.mockReturnValueOnce({
                from: () => ({
                    where: () => [cultura],
                }),
            });

            const result = await service.findOne(1);
            expect(result).toEqual([cultura]);
        });
    });

    describe('update', () => {
        it('deve atualizar uma cultura plantada', async () => {
            const dto = {
                nome: 'Algodão',
                fazendaId: 2,
                safraId: 2,
            };

            const culturaAtualizada = makeCulturaPlantada({ ...dto });
            mockDb.update.mockReturnValueOnce({
                set: () => ({
                    where: () => ({
                        returning: () => [culturaAtualizada],
                    }),
                }),
            });

            const result = await service.update(1, dto);
            expect(result).toEqual([culturaAtualizada]);
        });
    });

    describe('remove', () => {
        it('deve remover uma cultura plantada', async () => {
            mockDb.delete.mockReturnValueOnce({
                where: () => ({ success: true }),
            });

            const result = await service.remove(1);
            expect(result).toEqual({ success: true });
        });
    });
});