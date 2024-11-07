import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from '../../services/posts/posts.service';
import { NotFoundException } from '@nestjs/common';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
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

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a post if it exists', async () => {
    const post = await controller.getPostById(1);
    expect(post).toBeDefined();
    expect(post.idPublication).toBe(1);
  });

  it('should throw NotFoundException if post does not exist', async () => {
    try {
      await controller.getPostById(2);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Post not found');
    }
  });
});
