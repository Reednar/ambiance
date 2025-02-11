import { Test, TestingModule } from '@nestjs/testing';
import { InteragisService } from './interagis.service';
import { Interagis } from '../../entities/interagis.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('InteragisService', () => {
  let service: InteragisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteragisService,
        {
          provide: getRepositoryToken(Interagis),
          useValue: {
            // Ajouter ici les méthodes du service
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InteragisService>(InteragisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
