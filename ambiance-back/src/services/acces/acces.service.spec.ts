import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from './acces.service';
import { Post } from '../../entities/posts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AccesService', () => {
  let service: AccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
