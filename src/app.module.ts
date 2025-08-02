import { Module } from '@nestjs/common';
import { ProdutorModule } from './produtor/produtor.module';
import { FazendasModule } from './fazendas/fazendas.module';


@Module({
  imports: [ProdutorModule, FazendasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
