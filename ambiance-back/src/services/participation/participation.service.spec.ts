import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationService } from './participation.service';
import { Participation } from '../../entities/Participation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ParticipationService', () => {
  let service: ParticipationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipationService,
        {
          provide: getRepositoryToken(Participation),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ParticipationService>(ParticipationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
