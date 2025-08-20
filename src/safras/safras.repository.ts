import { Injectable } from "@nestjs/common";
import { CreateSafraDto } from "./dto/create-safra.dto";
import { safras } from "src/db/schema/safras";
import { db } from "src/db/connection";
import { eq } from "drizzle-orm";
import { UpdateSafraDto } from "./dto/update-safra.dto";

@Injectable()
export class SafrasRepository {
    async create(createSafraDto: CreateSafraDto) {
        return db.insert(safras).values(createSafraDto).returning();
    }

    async findAll() {
        return db.select().from(safras).orderBy(safras.ano);
    }

    async findOne(id: number) {
        return db.select().from(safras).where(eq(safras.id, id)).limit(1);
    }

    async update(id: number, updateSafraDto: UpdateSafraDto) {
        return db
            .update(safras)
            .set({
                ano: updateSafraDto.ano,
            })
            .where(eq(safras.id, id))
            .returning({
                id: safras.id,
                ano: safras.ano,
                createdAt: safras.createdAt,
            });
    }

    async remove(id: number) {
        return db.delete(safras).where(eq(safras.id, id));
    }
}