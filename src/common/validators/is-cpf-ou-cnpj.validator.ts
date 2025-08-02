import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function IsCpfOuCnpj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOuCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' && (cpf.isValid(value) || cnpj.isValid(value));
        },
        defaultMessage(_args: ValidationArguments) {
          return 'O CPF ou CNPJ informado é inválido';
        },
      },
    });
  };
}
