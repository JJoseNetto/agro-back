import { Injectable } from '@nestjs/common';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import { db } from 'src/db/connection';
import { eq } from 'drizzle-orm';
import { safras } from '../db/schema/safras';
import { SafrasRepository } from './safras.repository';

@Injectable()
export class SafrasService {
  constructor(private readonly safrasRepository: SafrasRepository) {}

  create(createSafraDto: CreateSafraDto) {
    return this.safrasRepository.create(createSafraDto);
  }

  findAll() {
    return this.safrasRepository.findAll();
  }

  findOne(id: number) {
    return this.safrasRepository.findOne(id);
  }

  update(id: number, updateSafraDto: UpdateSafraDto) {
    return this.safrasRepository.update(id, updateSafraDto);
  }

  remove(id: number) {
    return this.safrasRepository.remove(id);
  }
}
