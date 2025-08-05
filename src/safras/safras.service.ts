import { Injectable } from '@nestjs/common';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import { db } from 'src/db/connection';
import { eq } from 'drizzle-orm';
import { safras } from '../db/schema/safras';

@Injectable()
export class SafrasService {
  create(createSafraDto: CreateSafraDto) {
    return db.insert(safras).values({
      ano: createSafraDto.ano,
    }).returning({
      id: safras.id,
      ano: safras.ano,
      createdAt: safras.createdAt,
    });
  }

  findAll() {
    return db.select().from(safras).orderBy(safras.ano);
  }

  findOne(id: number) {
    return db.select().from(safras).where(eq(safras.id, id));
  }

  update(id: number, updateSafraDto: UpdateSafraDto) {
    return db.update(safras)
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

  remove(id: number) {
    return db.delete(safras).where(eq(safras.id, id));
  }
}
