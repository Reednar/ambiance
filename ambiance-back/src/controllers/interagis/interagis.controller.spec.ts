import { Test, TestingModule } from '@nestjs/testing';
import { interagisController } from './interagis.controller';

describe('imagesController', () => {
  let controller: interagisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [interagisController],
    }).compile();

    controller = module.get<interagisController>(interagisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
