import { Test, TestingModule } from '@nestjs/testing';
import { imagesController } from './images.controller';

describe('imagesController', () => {
  let controller: imagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [imagesController],
    }).compile();

    controller = module.get<imagesController>(imagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
