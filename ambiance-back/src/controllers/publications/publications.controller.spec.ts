import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsController } from './publications.controller';

let controller: PublicationsController;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [PublicationsController],
  }).compile();

  controller = module.get<PublicationsController>(PublicationsController);
});

// Ajout d'un test simple pour vérifier que le contrôleur est défini
it('should be defined', () => {
  expect(controller).toBeDefined();
});