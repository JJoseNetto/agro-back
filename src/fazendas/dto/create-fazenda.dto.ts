export class CreateFazendaDto {
    nome: string;
    cidade: string;
    estado: string; // UF
    areaTotal: string; // em hectares
    areaAgricultavel: string; // em hectares
    areaVegetacao: string; // em hectares
    produtorId: number; // ID do produtor associado
}
