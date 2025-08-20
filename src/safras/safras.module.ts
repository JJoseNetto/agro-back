import { Module } from '@nestjs/common';
import { SafrasService } from './safras.service';
import { SafrasController } from './safras.controller';
import { SafrasRepository } from './safras.repository';

@Module({
  controllers: [SafrasController],
  providers: [SafrasService, SafrasRepository],
  exports: [SafrasRepository],
})
export class SafrasModule {}
