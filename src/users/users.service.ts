import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { db } from 'src/db/connection';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema/users';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const existingUser = await db.select().from(users).where(eq(users.email, createUserDto.email)).limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    return db.insert(users).values({
      email: createUserDto.email,
      password: hashedPassword,
      nome: createUserDto.nome,
      isActive: createUserDto.isActive ? 1 : 0,
    }).returning({
      id: users.id,
      email: users.email,
      nome: users.nome,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    });
  }

  findAll() {
    return db.select().from(users).orderBy(users.nome);
  }

  async findOne(id: number) {
    const user = await db.select().from(users).where(eq(users.id, id));

    if (user.length === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user[0];
  }

  async findByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email)).limit(1);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    // Se está atualizando email, verificar se não está em uso
    if (updateUserDto.email) {
      const existingUser = await db.select().from(users).where(eq(users.email, updateUserDto.email)).limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== id) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Se está atualizando senha, fazer hash
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    return db.update(users).set({...updateData, updateAt: new Date()}).where(eq(users.id, id)).returning();
  }

  async remove(id: number) {
    await this.findOne(id);

    return db.delete(users).where(eq(users.id, id));
  }

  async toggleActive(id: number) {
    const user = await this.findOne(id);
    const newStatus = user.isActive === 1 ? 0 : 1;

    return db.update(users)
      .set({
        isActive: newStatus,
        updateAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        nome: users.nome,
        role: users.role,
        isActive: users.isActive,
        updatedAt: users.updateAt,
      });
  }
}
