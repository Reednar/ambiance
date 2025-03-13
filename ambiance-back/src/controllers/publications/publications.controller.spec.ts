import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from '../../services/publications/publications.service';
import { NotFoundException } from '@nestjs/common';

describe('PublicationsController', () => {
  let controller: PublicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationsController],
      providers: [
        {
          provide: PublicationsService,
          useValue: {
            findOne: jest.fn((id) => {
              if (id === 1) {
                return {
                  idPublication: 1,
                  codePostal: '78000',
                  rue: '2',
                  ville: 'Montigny',
                  titre: 'Cinéma',
                  dateEvenement: '2024-11-06T10:36:19.000Z',
                  description: 'Scary movie',
                  prix: '12.00',
                  lien: 'cineugc.com',
                  dateCreation: '2024-11-06T10:36:58.000Z',
                  participantMax: 10,
                  participantMin: 2,
                  typePost: 'activité',
                };
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PublicationsController>(PublicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a publication if it exists', async () => {
    const publication = await controller.getPublicationById(1);
    expect(publication).toBeDefined();
    expect(publication.idPublication).toBe(1);
  });

  it('should throw NotFoundException if publication does not exist', async () => {
    try {
      await controller.getPublicationById(2);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('publication not found');
    }
  });
});
