import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, IsOptional, IsBoolean, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({example: 'José Neto'})
    @IsString({ message: 'O nome deve ser um texto'})
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'usuario@exemplo.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'true' })
    @IsBoolean({ message: 'O status deve ser um booleano' })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ example: 'minhasenha12345' })
    @IsString({ message: 'A senha deve ser um texto' })
    @MinLength(6)
    @IsOptional()
    password?: string;
}
