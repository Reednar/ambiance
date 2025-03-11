import { Test, TestingModule } from '@nestjs/testing';
import { CommentairesController } from './commentaires.controller';
import { CommentairesService } from '../../services/commentaires/commentaires.service';

describe('CommentairesController', () => {
  let controller: CommentairesController;
  let service: CommentairesService;

  const mockCommentairesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentairesController],
      providers: [
        { provide: CommentairesService, useValue: mockCommentairesService },
      ],
    }).compile();

    controller = module.get<CommentairesController>(CommentairesController);
    service = module.get<CommentairesService>(CommentairesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
