import { Test, TestingModule } from '@nestjs/testing';
import { avisController } from './avis.controller';
import { AvisService } from '../../services/avis/avis.service';

describe('avisController', () => {
  let controller: avisController;
  let service: AvisService;

  const mockAvisService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [avisController],
      providers: [
        { provide: AvisService, useValue: mockAvisService },
      ],
    }).compile();

    controller = module.get<avisController>(avisController);
    service = module.get<AvisService>(AvisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
