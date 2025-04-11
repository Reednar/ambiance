import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionsController } from './discussions.controller';

describe('DiscussionsController', () => {
  let controller: DiscussionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionsController],
    }).compile();

    controller = module.get<DiscussionsController>(DiscussionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
