import { Injectable } from "@nestjs/common";
import { CreateCulturaPlantadaDto } from "./dto/create-cultura-plantada.dto";
import { culturasPlantadas } from "src/db/schema/culturas_plantadas";
import { db } from "src/db/connection";
import { CurrentUserDto } from "src/auth/dto/current-user.dto";
import { fazendas } from "src/db/schema/fazendas";
import { and, eq } from "drizzle-orm";
import { safras } from "src/db/schema/safras";
import { produtores } from "src/db/schema/produtor";
import { UpdateCulturaPlantadaDto } from "./dto/update-cultura-plantada.dto";

@Injectable()
export class CulturasPlantadasRepository {
    async create(data: CreateCulturaPlantadaDto) {
        return db.insert(culturasPlantadas).values(data).returning();
    }

    async findAll(user: CurrentUserDto) {

        return db.select({
            id: culturasPlantadas.id,
            nome: culturasPlantadas.nome,
            fazendaId: culturasPlantadas.fazendaId,
            safraId: culturasPlantadas.safraId,
            createdAt: culturasPlantadas.createdAt
            })
            .from(culturasPlantadas)
            .innerJoin(fazendas, eq(culturasPlantadas.fazendaId, fazendas.id))
            .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
            .innerJoin(safras, eq(culturasPlantadas.safraId, safras.id))
            .where(eq(produtores.userId, user.id));

    }

    async findOne(id: number, userId: number) {
        const [result] = await db.select({
                id: culturasPlantadas.id,
                fazendaId: culturasPlantadas.fazendaId,
                safraId: culturasPlantadas.safraId,
                nome: culturasPlantadas.nome
            })
            .from(culturasPlantadas)
            .innerJoin(fazendas, eq(culturasPlantadas.fazendaId, fazendas.id))
            .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
            .innerJoin(safras, eq(culturasPlantadas.safraId, safras.id))
            .where(and(eq(culturasPlantadas.id, id), eq(produtores.userId, userId)));

        return result;
    }

    async update(id: number, updateCulturaPlantadaDto: UpdateCulturaPlantadaDto) {

        return db.update(culturasPlantadas)
            .set(updateCulturaPlantadaDto)
            .where(eq(culturasPlantadas.id, id))
            .returning();
    }

    async remove(id: number) {
        return db.delete(culturasPlantadas)
            .where(eq(culturasPlantadas.id, id))
            .returning();
    }

    async validateCulturasPlantadasOwnership(fazendaId: number, userId: number) {
        const validation = await db
        .select()
        .from(fazendas)
        .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
        .where(and(eq(fazendas.id, fazendaId), eq(produtores.userId, userId)));


        return validation;
    }
}