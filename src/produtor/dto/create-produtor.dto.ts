import { IsNotEmpty } from "class-validator";
import { IsCpfOuCnpj } from 'src/common/validators/is-cpf-ou-cnpj.validator';

export class CreateProdutorDto {
    @IsNotEmpty({message: 'O nome é obrigatório'})
    nome: string;

    @IsNotEmpty({message: 'O CPF ou CNPJ é obrigatório'})
    @IsCpfOuCnpj({ message: 'CPF ou CNPJ inválido' })
    cpfOuCnpj: string;
}
