import { Injectable } from '@nestjs/common';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { db } from 'src/db/connection';
import { eq } from 'drizzle-orm';
import { fazendas } from '../db/schema/fazendas';

@Injectable()
export class FazendasService {
  async create(createFazendaDto: CreateFazendaDto) {
    return db.insert(fazendas).values({
      nome: createFazendaDto.nome,
      cidade: createFazendaDto.cidade,
      estado: createFazendaDto.estado,
      areaTotal: createFazendaDto.areaTotal,
      areaAgricultavel: createFazendaDto.areaAgricultavel,
      areaVegetacao: createFazendaDto.areaVegetacao,
      produtorId: createFazendaDto.produtorId,
    }).returning();
  }

  async findAll() {
    return db.select().from(fazendas).orderBy(fazendas.nome);
  }

  async findOne(id: number) {
    return db.select().from(fazendas).where(eq(fazendas.id, id)).limit(1);
  }

  async update(id: number, updateFazendaDto: UpdateFazendaDto) {
    return db.update(fazendas).set({
      nome: updateFazendaDto.nome,
      cidade: updateFazendaDto.cidade,
      estado: updateFazendaDto.estado,
      areaTotal: updateFazendaDto.areaTotal,
      areaAgricultavel: updateFazendaDto.areaAgricultavel,
      areaVegetacao: updateFazendaDto.areaVegetacao,
      produtorId: updateFazendaDto.produtorId,
    }).where(eq(fazendas.id, id)).returning();
  }

  async remove(id: number) {
    return db.delete(fazendas).where(eq(fazendas.id, id)).returning();
  }
}
