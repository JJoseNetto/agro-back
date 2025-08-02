import { Module } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { ProdutorController } from './produtor.controller';

@Module({
  controllers: [ProdutorController],
  providers: [ProdutorService],
})
export class ProdutorModule {}
