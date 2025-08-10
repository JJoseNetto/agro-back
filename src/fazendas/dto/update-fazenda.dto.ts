import { PartialType } from '@nestjs/mapped-types';
import { CreateFazendaDto } from './create-fazenda.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFazendaDto extends PartialType(CreateFazendaDto) {
    @ApiProperty({ example: 'Fazenda Boa Vista' })
    nome?: string;

    @ApiProperty({ example: 'São Paulo' })
    cidade?: string;

    @ApiProperty({ example: 'SP' })
    estado?: string;

    @ApiProperty({ example: '100' })
    areaTotal?: string;

    @ApiProperty({ example: '50' })
    areaAgricultavel?: string;

    @ApiProperty({ example: '30' })
    areaVegetacao?: string;

    @ApiProperty({ example: 1 })
    produtorId?: number;
}
