import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    @IsEmail({}, { message: 'Formato de email inválido' })
    email: string;

    @ApiProperty({ example: 'minhasenha123' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString({ message: 'A senha deve ser um texto' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password: string;

    @ApiProperty({ example: 'José Neto' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @IsString({ message: 'O nome deve ser um texto' })
    nome: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean({ message: 'isActive deve ser verdadeiro ou falso' })
    isActive?: boolean;
}
