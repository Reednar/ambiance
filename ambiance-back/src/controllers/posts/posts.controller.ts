import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from '../../services/posts/posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Return all posts' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    examples: {
      example1: {
        summary: 'Successful response example',
        value: [
          {
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
          },
        ],
      },
    },
  })
  async getPosts() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return one post by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    examples: {
      example1: {
        summary: 'Successful response example',
        value: {
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
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    examples: {
      example1: {
        summary: 'Not found response example',
        value: {
          statusCode: 404,
          message: 'Post not found',
          error: 'Not Found',
        },
      },
    },
  })
  async getPostById(@Param('id') id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}