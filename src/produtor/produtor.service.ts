import { Injectable } from '@nestjs/common';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { db } from '../db/connection';
import { eq } from 'drizzle-orm';
import { produtores } from '../db/schema/produtor';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProdutorService {
  async create(createProdutorDto: CreateProdutorDto) {

    const produtorExistente = await db.select().from(produtores).where(eq(produtores.cpfOuCnpj, createProdutorDto.cpfOuCnpj)).limit(1);
    if (produtorExistente.length > 0) {
      throw new BadRequestException('CPF ou CNPJ já cadastrado.');
    }

    return db.insert(produtores).values({
      nome: createProdutorDto.nome,
      cpfOuCnpj: createProdutorDto.cpfOuCnpj, 
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
    return db.select().from(produtores).where(eq(produtores.id, id)).limit(1);
  }

  async update(id: number, updateProdutorDto: UpdateProdutorDto) {
    return db.update(produtores).set({
      nome: updateProdutorDto.nome,
      cpfOuCnpj: updateProdutorDto.cpfOuCnpj,
    }).where(eq(produtores.id, id)).returning();
  }

  remove(id: number) {
    return db.delete(produtores).where(eq(produtores.id, id)).returning();
  }
}
