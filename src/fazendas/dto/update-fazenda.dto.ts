import { PartialType } from '@nestjs/mapped-types';
import { CreateFazendaDto } from './create-fazenda.dto';

export class UpdateFazendaDto extends PartialType(CreateFazendaDto) {
    nome?: string;
    cidade?: string;
    estado?: string;
    areaTotal?: string;
    areaAgricultavel?: string;
    areaVegetacao?: string;
    produtorId?: number;
}
