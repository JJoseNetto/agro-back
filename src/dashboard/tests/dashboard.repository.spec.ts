import { DashboardRepository } from '../dashboard.repository';
import { db } from 'src/db/connection';

jest.mock('src/db/connection', () => ({
  db: {
    select: jest.fn(),
  },
}));

describe('DashboardRepository', () => {
  let repository: DashboardRepository;

  beforeEach(() => {
    repository = new DashboardRepository();
    jest.clearAllMocks();
  });

  describe('getTotals', () => {
    it('deve retornar total de fazendas e hectares', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => [
              { totalFazendas: '3', totalHectares: '150' },
            ],
          }),
        }),
      });

      const result = await repository.getTotals(1);

      expect(result).toEqual({
        totalFazendas: 3,
        totalHectares: 150,
      });
      expect(db.select).toHaveBeenCalled();
    });

    it('deve retornar 0 quando não houver registros', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => [],
          }),
        }),
      });

      const result = await repository.getTotals(1);

      expect(result).toEqual({
        totalFazendas: 0,
        totalHectares: 0,
      });
    });
  });

  describe('getByState', () => {
    it('deve retornar distribuição por estado', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => ({
              groupBy: () => [
                { estado: 'MG', count: '2' },
                { estado: 'SP', count: '1' },
              ],
            }),
          }),
        }),
      });

      const result = await repository.getByState(1);

      expect(result).toEqual([
        { name: 'MG', value: 2 },
        { name: 'SP', value: 1 },
      ]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getByCulture', () => {
    it('deve retornar distribuição por cultura', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            innerJoin: () => ({
              where: () => ({
                groupBy: () => [
                  { cultura: 'Soja', count: '4' },
                  { cultura: 'Milho', count: '2' },
                ],
              }),
            }),
          }),
        }),
      });

      const result = await repository.getByCulture(1);

      expect(result).toEqual([
        { name: 'Soja', value: 4 },
        { name: 'Milho', value: 2 },
      ]);
    });
  });

  describe('getLandUse', () => {
    it('deve retornar distribuição de uso do solo', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => [
              { totalAgricultavel: '100', totalVegetacao: '50' },
            ],
          }),
        }),
      });

      const result = await repository.getLandUse(1);

      expect(result).toEqual([
        { name: 'Área Agricultável', value: 100 },
        { name: 'Área de Vegetação', value: 50 },
      ]);
    });

    it('deve retornar valores zerados se não houver registros', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          innerJoin: () => ({
            where: () => [],
          }),
        }),
      });

      const result = await repository.getLandUse(1);

      expect(result).toEqual([
        { name: 'Área Agricultável', value: 0 },
        { name: 'Área de Vegetação', value: 0 },
      ]);
    });
  });
});
