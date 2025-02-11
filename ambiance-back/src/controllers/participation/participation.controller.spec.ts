import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationController } from './participation.controller';
import { ParticipationService } from '../../services/participation/participation.service';

describe('ParticipationController', () => {
  let controller: ParticipationController;
  let service: ParticipationService;

  const mockParticipationService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationController],
      providers: [
        { provide: ParticipationService, useValue: mockParticipationService },
      ],
    }).compile();

    controller = module.get<ParticipationController>(ParticipationController);
    service = module.get<ParticipationService>(ParticipationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
