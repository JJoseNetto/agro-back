import { Injectable } from '@nestjs/common';
import { CreateCulturaPlantadaDto } from './dto/create-cultura-plantada.dto';
import { UpdateCulturaPlantadaDto } from './dto/update-cultura-plantada.dto';
import { db } from 'src/db/connection';
import { eq } from 'drizzle-orm';
import { culturasPlantadas } from '../db/schema/culturas_plantadas';

@Injectable()
export class CulturasPlantadasService {
    create(createCulturaPlantadaDto: CreateCulturaPlantadaDto) {
        return db.insert(culturasPlantadas).values({
            nome: createCulturaPlantadaDto.nome,
            fazendaId: createCulturaPlantadaDto.fazendaId,
            safraId: createCulturaPlantadaDto.safraId,
        }).returning({
            id: culturasPlantadas.id,
            nome: culturasPlantadas.nome,
            fazendaId: culturasPlantadas.fazendaId,
            safraId: culturasPlantadas.safraId,
            createdAt: culturasPlantadas.createdAt,
        });
    }

    findAll() {
        return db.select().from(culturasPlantadas).orderBy(culturasPlantadas.nome);
    }

    findOne(id: number) {
        return db.select().from(culturasPlantadas).where(eq(culturasPlantadas.id, id));
    }

    update(id: number, updateCulturaPlantadaDto: UpdateCulturaPlantadaDto) {
        return db.update(culturasPlantadas)
            .set({
                nome: updateCulturaPlantadaDto.nome,
                fazendaId: updateCulturaPlantadaDto.fazendaId,
                safraId: updateCulturaPlantadaDto.safraId,
            })
            .where(eq(culturasPlantadas.id, id))
            .returning({
                id: culturasPlantadas.id,
                nome: culturasPlantadas.nome,
                fazendaId: culturasPlantadas.fazendaId,
                safraId: culturasPlantadas.safraId,
                createdAt: culturasPlantadas.createdAt,
            });
    }

    remove(id: number) {
        return db.delete(culturasPlantadas).where(eq(culturasPlantadas.id, id));
    }
}
