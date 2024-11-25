import { Test, TestingModule } from '@nestjs/testing';
import { AccesController } from './acces.controller';

describe('GroupsController', () => {
  let controller: AccesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccesController],
    }).compile();

    controller = module.get<AccesController>(AccesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
