import { validate } from 'class-validator';
import { IsCpfOuCnpj } from './is-cpf-ou-cnpj.validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';

class TestDto {
  @IsCpfOuCnpj()
  documento: string;
}

describe('IsCpfOuCnpj', () => {
  it('deve aceitar CPF válido', async () => {
    const dto = new TestDto();
    dto.documento = cpf.generate(); // CPF válido

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve aceitar CNPJ válido', async () => {
    const dto = new TestDto();
    dto.documento = cnpj.generate(); // CNPJ válido

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve rejeitar CPF inválido', async () => {
    const dto = new TestDto();
    dto.documento = '123.456.789-09'; // CPF inválido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isCpfOuCnpj');
  });

  it('deve rejeitar CNPJ inválido', async () => {
    const dto = new TestDto();
    dto.documento = '12.345.678/0001-00'; // CNPJ inválido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isCpfOuCnpj');
  });

  it('deve rejeitar valores não string', async () => {
    const dto = new TestDto();
    // @ts-expect-error: Testando valor incorreto propositalmente
    dto.documento = 12345678900;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isCpfOuCnpj');
  });
});
