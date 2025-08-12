import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { db } from '../db/connection';
import { eq } from 'drizzle-orm';
import { produtores } from '../db/schema/produtor';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ProdutorService {
  async create(createProdutorDto: CreateProdutorDto) {

    const produtorExistente = await db.select().from(produtores).where(eq(produtores.cpfOuCnpj, createProdutorDto.cpfOuCnpj)).limit(1);
    if (produtorExistente.length > 0) {
      throw new ConflictException('CPF ou CNPJ já está em uso');
    }

    if (!createProdutorDto.userId) {
      throw new ConflictException('O ID do usuário é obrigatório');
    }

    return db.insert(produtores).values({
      nome: createProdutorDto.nome,
      cpfOuCnpj: createProdutorDto.cpfOuCnpj,
      userId: createProdutorDto.userId, 
      }).returning({
        id: produtores.id,
        nome: produtores.nome,
        cpfOuCnpj: produtores.cpfOuCnpj,
        createdAt: produtores.createdAt,
      });
  }

  async findAll() {
    return db.select().from(produtores).orderBy(produtores.nome);
  }

  async findOne(id: number) {

    const produtor =  await db.select().from(produtores).where(eq(produtores.id, id));

    if (produtor.length === 0) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return produtor[0];
  }

  async update(id: number, updateProdutorDto: UpdateProdutorDto) {
    await this.findOne(id);

    return db.update(produtores).set({
      nome: updateProdutorDto.nome,
      cpfOuCnpj: updateProdutorDto.cpfOuCnpj,
    }).where(eq(produtores.id, id)).returning();
  }

  async remove(id: number) {
    await this.findOne(id);

    return db.delete(produtores).where(eq(produtores.id, id)).returning();
  }

  async findByUserId(userId: number) {
    return await db.select().from(produtores).where(eq(produtores.userId, userId));
  }

}
