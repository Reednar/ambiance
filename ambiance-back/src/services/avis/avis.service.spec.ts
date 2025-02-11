import { Test, TestingModule } from '@nestjs/testing';
import { AvisService } from './avis.service';
import { Avis } from '../../entities/avis.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AvisService', () => {
  let service: AvisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvisService,
        {
          provide: getRepositoryToken(Avis),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AvisService>(AvisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
