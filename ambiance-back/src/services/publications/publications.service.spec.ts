import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsService } from './publications.service';
import { Publication } from '../../entities/publications.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PublicationsService', () => {
  let service: PublicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationsService,
        {
          provide: getRepositoryToken(Publication),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PublicationsService>(PublicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
