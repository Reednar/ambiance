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
                  placeHandicape: null,
                  rampe: null,
                  ascenseur: null,
                  utilisateurId: 5,
                  idEcole: 3,
                  listeEcoleIds: [1, 2, 3],
                  ecole: { nom: 'École ABC' },
                  image: Buffer.from('fakeimage'),
                  imageMimeType: 'image/png',
                  publicationCategories: [
                    {
                      categorie: {
                        idCategorie: 1,
                        nom: 'Cinéma',
                      },
                    },
                  ],
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
    // On ne passe plus de paramètre req, car il est optionnel
    const publication = await controller.getPublicationById(1);

    expect(publication).toBeDefined();
    expect(publication.idPublication).toBe(1);
    expect(publication.titre).toBe('Cinéma');
    expect(publication.categories.length).toBe(1);
    expect(publication.categories[0].nom).toBe('Cinéma');
    expect(publication.idUtilisateur).toBe(5);
    expect(publication.nomEcole).toBe('École ABC');
    expect(publication.image).toMatch(/^data:image\/png;base64,/);
  });

  it('should throw NotFoundException if publication does not exist', async () => {
    await expect(controller.getPublicationById(2)).rejects.toThrow(
      NotFoundException,
    );
    await expect(controller.getPublicationById(2)).rejects.toThrow(
      'publication not found',
    );
  });
});
