import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Categorie } from '../../entities/categories.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Categorie),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
