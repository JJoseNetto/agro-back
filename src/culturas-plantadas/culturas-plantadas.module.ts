import { Module } from '@nestjs/common';
import { CulturasPlantadasService } from './culturas-plantadas.service';
import { CulturasPlantadasController } from './culturas-plantadas.controller';

@Module({
    controllers: [CulturasPlantadasController],
    providers: [CulturasPlantadasService],
})
export class CulturasPlantadasModule { }
