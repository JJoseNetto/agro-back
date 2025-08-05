import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCulturaPlantadaDto {
    @ApiProperty({ example: 'Soja' })
    @IsNotEmpty({ message: 'O nome da cultura é obrigatório' })
    @IsString({ message: 'O nome deve ser um texto' })
    nome: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O ID da fazenda é obrigatório' })
    @IsNumber({}, { message: 'O ID da fazenda deve ser um número' })
    fazendaId: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O ID da safra é obrigatório' })
    @IsNumber({}, { message: 'O ID da safra deve ser um número' })
    safraId: number;
}
