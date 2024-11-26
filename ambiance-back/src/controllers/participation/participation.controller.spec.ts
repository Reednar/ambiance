import { Test, TestingModule } from '@nestjs/testing';
import { participationController } from './participation.controller';

describe('participationController', () => {
  let controller: participationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [participationController],
    }).compile();

    controller = module.get<participationController>(participationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
