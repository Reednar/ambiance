import { Test, TestingModule } from '@nestjs/testing';
import { avisController } from './avis.controller';

describe('avisController', () => {
  let controller: avisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [avisController],
    }).compile();

    controller = module.get<avisController>(avisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
