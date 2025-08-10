import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
  email: string;

  @ApiProperty({ example: 'minhasenha123' })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}
