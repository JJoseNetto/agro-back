import { Module } from '@nestjs/common';
import { CulturasPlantadasService } from './culturas-plantadas.service';
import { CulturasPlantadasController } from './culturas-plantadas.controller';
import { CulturasPlantadasRepository } from './culturas-plantadas.repository';

@Module({
    controllers: [CulturasPlantadasController],
    providers: [CulturasPlantadasService, CulturasPlantadasRepository],
    exports: [CulturasPlantadasRepository]
})
export class CulturasPlantadasModule { }
