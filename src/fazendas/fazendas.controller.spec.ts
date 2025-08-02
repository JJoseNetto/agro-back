import { Test, TestingModule } from '@nestjs/testing';
import { FazendasController } from './fazendas.controller';
import { FazendasService } from './fazendas.service';

describe('FazendasController', () => {
  let controller: FazendasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FazendasController],
      providers: [FazendasService],
    }).compile();

    controller = module.get<FazendasController>(FazendasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
