import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { ConflictException } from '@nestjs/common';
import { ProdutorRepository } from './produtor.repository';

@Injectable()
export class ProdutorService {
  constructor(private readonly produtorRepository: ProdutorRepository) {}

  async create(createProdutorDto: CreateProdutorDto) {
    const produtorExistente = await this.findByCpfProdutor(createProdutorDto.cpfOuCnpj);

    if (produtorExistente.length > 0) {
      throw new ConflictException('CPF ou CNPJ já está em uso');
    }

    return this.produtorRepository.create(createProdutorDto);
  }

  async findAll(userId: number) {
    return await this.produtorRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const produtor = await this.produtorRepository.findOne(id, userId);

    if (produtor.length === 0) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return produtor;
  }

  async update(id: number, userId: number, UpdateProdutorDto: UpdateProdutorDto) {
    await this.findOne(id, userId);

    if (id) {
      await this.validateProdutorOwnership(id, userId);
    }

    return this.produtorRepository.update(id, userId, UpdateProdutorDto);
  }

  async removeByUser(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.produtorRepository.remove(id);
  }

  async findByCpfProdutor(cpfOuCnpj: string) {
    return await this.produtorRepository.findByCpfProdutor(cpfOuCnpj);
  }

  private async validateProdutorOwnership(produtorId: number, userId: number) {
    const validation = await this.produtorRepository.validateProdutorOwnership(produtorId, userId);

    if (!validation) {
      throw new ForbiddenException('Você não tem permissão para usar este produtor');
    }
  }
}