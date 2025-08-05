import { PartialType } from '@nestjs/swagger';
import { CreateSafraDto } from './create-safra.dto';

export class UpdateSafraDto extends PartialType(CreateSafraDto) { }
