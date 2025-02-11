import { Test, TestingModule } from '@nestjs/testing';
import { imagesController } from './images.controller';
import { ImagesService } from '../../services/images/images.service';

describe('ImagesController', () => {
  let controller: imagesController;
  let service: ImagesService;

  const mockImagesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [imagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: mockImagesService,
        },
      ],
    }).compile();

    controller = module.get<imagesController>(imagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
