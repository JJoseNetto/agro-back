import { Module } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { FazendasController } from './fazendas.controller';
import { FazendasRepository } from './fazendas.repository';

@Module({
  controllers: [FazendasController],
  providers: [FazendasService, FazendasRepository],
  exports: [FazendasRepository]
})
export class FazendasModule {}
