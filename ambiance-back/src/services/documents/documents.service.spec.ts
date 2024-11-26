import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { Post } from '../../entities/posts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
