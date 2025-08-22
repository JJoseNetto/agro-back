import { Module } from '@nestjs/common';
import { ProdutorModule } from './produtor/produtor.module';
import { FazendasModule } from './fazendas/fazendas.module';
import { SafrasModule } from './safras/safras.module';
import { CulturasPlantadasModule } from './culturas-plantadas/culturas-plantadas.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [ProdutorModule, FazendasModule, SafrasModule, CulturasPlantadasModule, UsersModule, AuthModule, DashboardModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
