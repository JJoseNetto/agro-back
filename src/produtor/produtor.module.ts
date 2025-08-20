import { Module } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { ProdutorController } from './produtor.controller';
import { ProdutorRepository } from './produtor.repository';

@Module({
  controllers: [ProdutorController],
  providers: [ProdutorService, ProdutorRepository],
  exports: [ProdutorRepository]
})
export class ProdutorModule {}
