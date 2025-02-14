import { Controller, Get, Post, Param, NotFoundException, UseGuards, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from '../../services/posts/posts.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service';
import { Console } from 'console';


@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService,  private readonly usersService: UsersService) { }


  @Get('test')//endpoint (endpoit ALWAYS before controller endpoint)
  @UseGuards(AuthGuard('jwt')) //protected request
  getProtectedData() {
    return { message: 'Accès autorisé à la route protégée.' };
  }

  @Post("delete")
  @UseGuards(AuthGuard('jwt'))
  async deletePost(@Body() Body: {idPublication: number, utilisateurId: number}) {
    const utilisateur = await this.usersService.findOne(Body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const post = await this.postsService.findOne(Body.idPublication);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.utilisateurId !== utilisateur.idUtilisateur) {
      throw new NotFoundException('Utilisateur non autorisé à supprimer ce post');
    }
    return await this.postsService.remove(post.idPublication);
  }

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

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: 201,
    description: 'Post created',
    examples: {
      example1: {
        summary: 'Post created example',
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
  async createPost(@Body() Body:
    {
      codePostal: string;
      rue: string;
      ville: string;
      titre: string;
      dateEvenement: Date;
      description: string;
      prix: number;
      lien: string;
      participantMax: number;
      participantMin: number;
      typePost: 'Evenement' | 'activité';
      placeHandicape: boolean;
      rampe: boolean,
      ascenseur: boolean,
      utilisateurId: number;
    }) {
    const utilisateur = await this.usersService.findOne(Body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const post = {...Body, utilisateur};
    return await this.postsService.create(post);
  }
}
