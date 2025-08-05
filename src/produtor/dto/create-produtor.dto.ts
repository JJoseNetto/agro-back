import { IsNotEmpty } from "class-validator";
import { IsCpfOuCnpj } from 'src/common/validators/is-cpf-ou-cnpj.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProdutorDto {
    @ApiProperty({ example: 'José Neto' })
    @IsNotEmpty({message: 'O nome é obrigatório'})
    nome: string;

    @ApiProperty({ example: '123.123.123-00', description: 'CPF ou CNPJ do produtor' })
    @IsNotEmpty({message: 'O CPF ou CNPJ é obrigatório'})
    @IsCpfOuCnpj({ message: 'CPF ou CNPJ inválido' })
    cpfOuCnpj: string;
}
