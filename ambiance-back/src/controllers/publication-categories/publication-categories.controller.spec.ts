import { Test, TestingModule } from '@nestjs/testing';
import { PublicationCategoriesController } from './publication-categories.controller';

describe('PublicationCategoriesController', () => {
  let controller: PublicationCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationCategoriesController],
    }).compile();

    controller = module.get<PublicationCategoriesController>(PublicationCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
