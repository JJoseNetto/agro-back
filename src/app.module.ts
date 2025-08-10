import { Module } from '@nestjs/common';
import { ProdutorModule } from './produtor/produtor.module';
import { FazendasModule } from './fazendas/fazendas.module';
import { SafrasModule } from './safras/safras.module';
import { CulturasPlantadasModule } from './culturas-plantadas/culturas-plantadas.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ProdutorModule, FazendasModule, SafrasModule, CulturasPlantadasModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
