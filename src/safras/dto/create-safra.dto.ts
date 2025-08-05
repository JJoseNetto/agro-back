import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSafraDto {
    @ApiProperty({ example: '2025' })
    @IsNotEmpty({message: 'O ano é obrigatório'})
    ano: number;
}


