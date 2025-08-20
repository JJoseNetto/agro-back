import { Injectable } from "@nestjs/common";
import { db } from "src/db/connection";
import { produtores } from "src/db/schema/produtor";
import { CreateProdutorDto } from "./dto/create-produtor.dto";
import { and, eq } from "drizzle-orm";
import { UpdateProdutorDto } from "./dto/update-produtor.dto";

@Injectable()
export class ProdutorRepository {
   async create(createProdutorDto: CreateProdutorDto, userId: number) {
       return db.insert(produtores).values({ ...createProdutorDto, userId }).returning();
   }

   async findAll(userId: number) {
       return db.select().from(produtores).where(eq(produtores.userId, userId));
   }

   async findOne(id: number, userId: number) {
       return db.select().from(produtores).where(and(eq(produtores.id, id), eq(produtores.userId, userId)));
   }

   async update(id: number, userId: number, updateData: UpdateProdutorDto) {
       return db.update(produtores).set(updateData).where(and(eq(produtores.id, id), eq(produtores.userId, userId))).returning();
   }

   async remove(id: number) {
       return db.delete(produtores).where(eq(produtores.id, id)).returning();
   }

   async findByCpfProdutor(cpfOuCnpj: string) {
       return db.select().from(produtores).where(eq(produtores.cpfOuCnpj, cpfOuCnpj)).limit(1);
   }

   async validateProdutorOwnership(produtorId: number, userId: number) {
        const result = await db
            .select({ id: produtores.id })
            .from(produtores)
            .where(and(eq(produtores.id, produtorId),eq(produtores.userId, userId))
            )
            .limit(1);
        
        return result.length > 0
   }
}
