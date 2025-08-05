import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutorDto } from './create-produtor.dto';
import { IsNotEmpty } from "class-validator";
import { IsCpfOuCnpj } from 'src/common/validators/is-cpf-ou-cnpj.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProdutorDto extends PartialType(CreateProdutorDto) {
    @ApiProperty({ example: 'José Neto Atualizado' })
    nome?: string;

    @ApiProperty({ example: '123.123.123-00', description: 'CPF ou CNPJ do produtor' })
    @IsCpfOuCnpj({ message: 'CPF ou CNPJ inválido' })
    cpfOuCnpj?: string;
}
