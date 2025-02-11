import { Test, TestingModule } from '@nestjs/testing';
import { interagisController } from './interagis.controller';
import { InteragisService } from '../../services/interagis/interagis.service';

describe('interagisController', () => {
  let controller: interagisController;
  let service: InteragisService;

  const mockInteragisService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [interagisController],
      providers: [
        { provide: InteragisService, useValue: mockInteragisService },
      ],
    }).compile();

    controller = module.get<interagisController>(interagisController);
    service = module.get<InteragisService>(InteragisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
