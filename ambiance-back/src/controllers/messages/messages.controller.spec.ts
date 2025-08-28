import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './messages.controller';
import { Logger } from '@nestjs/common';
import { MessageService } from 'src/services/messages/messages.service';

describe('MessageController', () => {
  let controller: MessageController;

  const mockMessageService = {
    // tu peux ajouter ici les méthodes attendues par le contrôleur
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
        Logger, // si tu injectes Logger, ajoute-le ici aussi
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
