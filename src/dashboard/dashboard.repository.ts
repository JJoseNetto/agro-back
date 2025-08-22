import { Injectable } from '@nestjs/common';
import { fazendas } from 'src/db/schema/fazendas';
import { produtores } from 'src/db/schema/produtor';
import { culturasPlantadas } from 'src/db/schema/culturas_plantadas';
import { sql, eq } from 'drizzle-orm';
import { db } from 'src/db/connection';

@Injectable()
export class DashboardRepository {

  async getTotals(userId: number) {
    const result = await db
      .select({
        totalFazendas: sql<number>`count(${fazendas.id})`,
        totalHectares: sql<number>`sum(${fazendas.areaTotal})`,
      })
      .from(fazendas)
      .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
      .where(eq(produtores.userId, userId));

    return {
      totalFazendas: Number(result[0]?.totalFazendas || 0),
      totalHectares: Number(result[0]?.totalHectares || 0),
    };
  }

  async getByState(userId: number) {
    const result = await db
      .select({
        estado: fazendas.estado,
        count: sql<number>`count(${fazendas.id})`,
      })
      .from(fazendas)
      .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
      .where(eq(produtores.userId, userId))
      .groupBy(fazendas.estado);

    return result.map(item => ({
      name: item.estado,
      value: Number(item.count),
    }));
  }

  async getByCulture(userId: number) {
    const result = await db
      .select({
        cultura: culturasPlantadas.nome,
        count: sql<number>`count(${culturasPlantadas.id})`,
      })
      .from(culturasPlantadas)
      .innerJoin(fazendas, eq(culturasPlantadas.fazendaId, fazendas.id))
      .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
      .where(eq(produtores.userId, userId))
      .groupBy(culturasPlantadas.nome);

    return result.map(item => ({
      name: item.cultura,
      value: Number(item.count),
    }));
  }

  async getLandUse(userId: number) {
    const result = await db
      .select({
        totalAgricultavel: sql<number>`sum(${fazendas.areaAgricultavel})`,
        totalVegetacao: sql<number>`sum(${fazendas.areaVegetacao})`,
      })
      .from(fazendas)
      .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
      .where(eq(produtores.userId, userId));

    const data = result[0];
    return [
      {
        name: 'Área Agricultável',
        value: Number(data?.totalAgricultavel || 0),
      },
      {
        name: 'Área de Vegetação',
        value: Number(data?.totalVegetacao || 0),
      },
    ];
  }
}