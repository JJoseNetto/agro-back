import { PartialType } from '@nestjs/swagger';
import { CreateCulturaPlantadaDto } from './create-cultura-plantada.dto';

export class UpdateCulturaPlantadaDto extends PartialType(CreateCulturaPlantadaDto) { }
