import { Module } from '@nestjs/common';
import { ProdutorModule } from './produtor/produtor.module';
import { FazendasModule } from './fazendas/fazendas.module';
import { SafrasModule } from './safras/safras.module';
import { CulturasPlantadasModule } from './culturas-plantadas/culturas-plantadas.module';


@Module({
  imports: [ProdutorModule, FazendasModule, SafrasModule, CulturasPlantadasModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
