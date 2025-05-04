import { Test, TestingModule } from '@nestjs/testing';
import { PublicationCategoriesService } from './publication-categories.service';

describe('PublicationCategoriesService', () => {
  let service: PublicationCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationCategoriesService],
    }).compile();

    service = module.get<PublicationCategoriesService>(PublicationCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
