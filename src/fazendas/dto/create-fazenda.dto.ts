import { IsNotEmpty } from "class-validator";
import { IsCpfOuCnpj } from 'src/common/validators/is-cpf-ou-cnpj.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFazendaDto {
    @ApiProperty({ description: 'Nome da fazenda' })
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    nome: string;

    @ApiProperty({ example: 'São Paulo' })
    @IsNotEmpty({ message: 'A cidade é obrigatória' })
    cidade: string;

    @ApiProperty({ example: 'SP' })
    @IsNotEmpty({ message: 'O estado é obrigatório' })
    estado: string; // UF

    @ApiProperty({ example: 100 })
    @IsNotEmpty({ message: 'A área total é obrigatória' })
    areaTotal: string; // em hectares

    @ApiProperty({ example: 50 })
    @IsNotEmpty({ message: 'A área cultivável é obrigatória' })
    areaAgricultavel: string; // em hectares

    @ApiProperty({ example: 30 })
    @IsNotEmpty({ message: 'A área de vegetação é obrigatória' })
    areaVegetacao: string; // em hectares
    
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O ID do produtor é obrigatório' })
    produtorId: number; // ID do produtor associado
}
