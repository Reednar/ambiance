import { Test, TestingModule } from '@nestjs/testing';
import { CommentairesService } from './commentaires.service';
import { Commentaire } from '../../entities/commentaires.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommentairesService', () => {
  let service: CommentairesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentairesService,
        {
          provide: getRepositoryToken(Commentaire),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentairesService>(CommentairesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
