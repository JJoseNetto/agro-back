import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCulturaPlantadaDto } from './dto/create-cultura-plantada.dto';
import { UpdateCulturaPlantadaDto } from './dto/update-cultura-plantada.dto';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { CulturasPlantadasRepository } from './culturas-plantadas.repository';

@Injectable()
export class CulturasPlantadasService {
    constructor(private readonly culturasPlantadasRepository: CulturasPlantadasRepository) {}

    async create(createCulturaPlantadaDto: CreateCulturaPlantadaDto, user: CurrentUserDto){
        await this.validateCulturasPlantadasOwnership(createCulturaPlantadaDto.fazendaId, user.id);

        const culturaPlantada = await this.culturasPlantadasRepository.create(createCulturaPlantadaDto);

        return culturaPlantada;
    }

    async findAll(user: CurrentUserDto) {
        return this.culturasPlantadasRepository.findAll(user);
    }

    async findOne(id: number, userId: number) {
        const result = await this.culturasPlantadasRepository.findOne(id, userId);

        if (!result) {
            throw new NotFoundException('Cultura plantada não encontrada');
        }

        return result;
    }

    async update(id: number, updateCulturaPlantadaDto: UpdateCulturaPlantadaDto, user: CurrentUserDto) {
        const VerifyCulturaPlantada = await this.findOne(id, user.id);

        await this.validateCulturasPlantadasOwnership(VerifyCulturaPlantada.fazendaId, user.id);

        const culturaPlantada = await this.culturasPlantadasRepository.update(id, updateCulturaPlantadaDto);

        return culturaPlantada;
    }

    async remove(id: number, user: CurrentUserDto){
        await this.findOne(id, user.id);

        await this.culturasPlantadasRepository.remove(id);

        return { message: 'Cultura plantada removida com sucesso' };
    }

    private async validateCulturasPlantadasOwnership(fazendaId: number, userId: number) {
        const validation = await this.culturasPlantadasRepository.validateCulturasPlantadasOwnership(fazendaId, userId);
    
        if (!validation) {
            throw new ForbiddenException('Você não tem permissão para usar esta cultura plantada');
        }
    }
}
