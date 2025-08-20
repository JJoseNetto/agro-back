import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';

import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { FazendasRepository } from './fazendas.repository';

@Injectable()
export class FazendasService {
  constructor(private readonly fazendasRepository: FazendasRepository) {}

  async create(createFazendaDto: CreateFazendaDto, user: CurrentUserDto) {
    await this.validateFazendaOwnership(createFazendaDto.produtorId, user.id);

    const fazenda = await this.fazendasRepository.create(createFazendaDto);

    return fazenda;
  }

    async findAll(user: CurrentUserDto) {
    const result = await this.fazendasRepository.findAll(user);

    return result;
  }

  async findOne(id: number, user: CurrentUserDto) {
    const fazenda = await this.fazendasRepository.findOne(id, user.id);

    if (!fazenda) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    return fazenda;
  }

  async update(id: number, updateFazendaDto: UpdateFazendaDto, user: CurrentUserDto) {
    
    await this.findOne(id, user);
    
    if (updateFazendaDto.produtorId) {
      await this.validateFazendaOwnership(updateFazendaDto.produtorId, user.id);
    }

    const [updatedFazenda] = await this.fazendasRepository.update(id, updateFazendaDto);

    return updatedFazenda;
  }

  async remove(id: number, user: CurrentUserDto) {
    
    await this.findOne(id, user);

    await this.fazendasRepository.remove(id);

    return { message: 'Fazenda deletada com sucesso' };
  }

  private async validateFazendaOwnership(produtorId: number, userId: number) {
    const validation = await this.fazendasRepository.validateFazendaOwnership(produtorId, userId);

    if (!validation || validation.length === 0) {
      throw new ForbiddenException('Você não tem permissão para usar este produtor');
    }
  }
}