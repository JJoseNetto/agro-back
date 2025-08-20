import { Injectable } from "@nestjs/common";
import { db } from "src/db/connection";
import { users } from "src/db/schema/users";
import { CreateUserDto } from "./dto/create-user.dto";
import { eq } from "drizzle-orm";

@Injectable()
export class UsersRepository {
    async create(createUserDto: CreateUserDto, hashedPassword: string) {
        return db.insert(users).values({
            email: createUserDto.email,
            password: hashedPassword,
            nome: createUserDto.nome,
            isActive: Boolean(createUserDto.isActive),
        }).returning({
            id: users.id,
            email: users.email,
            nome: users.nome,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
        });
    }

    async findAll() {
        return db.select().from(users).orderBy(users.nome);
    }

    async findOne(id: number) {
        return db.select().from(users).where(eq(users.id, id)).limit(1);
    }

    async findByEmail(email: string) {
        return db.select().from(users).where(eq(users.email, email)).limit(1);
    }

    async update(id: number, updateData: any) {
        return db.update(users).set({...updateData, updatedAt: new Date()}).where(eq(users.id, id)).returning();
    }

    async remove(id: number) {
        return db.delete(users).where(eq(users.id, id));
    }

    async toggleActive(id: number, isActive: boolean) {
        return db.update(users).set({ isActive, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    }
}