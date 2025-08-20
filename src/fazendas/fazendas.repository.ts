import { Injectable } from "@nestjs/common";
import { CreateFazendaDto } from "./dto/create-fazenda.dto";
import { CurrentUserDto } from "src/auth/dto/current-user.dto";
import { fazendas } from "src/db/schema/fazendas";
import { db } from "src/db/connection";
import { produtores } from "src/db/schema/produtor";
import { and, eq } from "drizzle-orm";
import { UpdateFazendaDto } from "./dto/update-fazenda.dto";

@Injectable()
export class FazendasRepository {
   async create(createFazendaDto: CreateFazendaDto) {
       return db.insert(fazendas).values(createFazendaDto).returning()
   }

   async findAll(user: CurrentUserDto) {
       return db
           .select()
           .from(fazendas)
           .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
           .where(eq(produtores.userId, user.id));
   }

   async findOne(id: number, userId: number) {
        const [fazenda] = await db
            .select()
            .from(fazendas)
            .innerJoin(produtores, eq(fazendas.produtorId, produtores.id))
            .where(and(
                eq(fazendas.id, id),
                eq(produtores.userId, userId)
            ));

        return fazenda;
   }

   async update(id: number, updateFazendaDto: UpdateFazendaDto) {
       return db
           .update(fazendas)
           .set(updateFazendaDto)
           .where(eq(fazendas.id, id))
           .returning();
   }

   async remove(id: number) {
       return db
           .delete(fazendas)
           .where(eq(fazendas.id, id))
           .returning();
   }

   async validateFazendaOwnership(produtorId: number, userId: number) {
       const validation = await db.select()
       .from(produtores)
       .where(and(eq(produtores.id, produtorId), eq(produtores.userId, userId)));

       return validation;
   }
}
