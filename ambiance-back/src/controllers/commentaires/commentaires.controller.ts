import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CommentairesService } from '../../services/commentaires/commentaires.service';
import { AuthGuard } from '@nestjs/passport'; // Peut être utilisé, mais ici non utilisé directement
import { UsersService } from '../../services/users/users.service';
import { PublicationsService } from 'src/services/publications/publications.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';

@ApiTags('commentaires') // Regroupe les routes dans Swagger sous "commentaires"
@Controller('commentaires') // Route de base : /commentaires
export class CommentairesController {
  constructor(
    private commentairesService: CommentairesService,
    private usersService: UsersService,
    private publicationsService: PublicationsService,
    private readonly logger: Logger,
  ) {}

  @Post('findAll')
  @UseGuards(JwtAuthGuard) // Protégé par JWT (authentification requise)
  @ApiOperation({ summary: 'Return all commentaires' }) // Documentation Swagger
  async getCommentaires() {
    this.logger.log('/commentaires/findAll called');
    return await this.commentairesService.findAll(); // Récupère tous les commentaires
  }

  @Post('findOne')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find a commentaire by ID' })
  async getCommentaire(@Body() body: { id: number }) {
    this.logger.log('/commentaires/findOne called');
    return await this.commentairesService.findOne(body.id); // Récupère un commentaire spécifique
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new commentaire' })
  async createCommentaire(
    @Body() body: { content: string; userId: number; postId: number },
  ) {
    this.logger.log('/commentaires/create called');

    // Vérifie l'existence de l'utilisateur et de la publication
    const user = await this.usersService.findEntityById(body.userId);
    const post = await this.publicationsService.findOne(body.postId);

    // Crée le commentaire
    return await this.commentairesService.create({
      contenu: body.content,
      idUtilisateur: user,
      idPublication: post,
    });
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing commentaire' })
  async updateCommentaire(@Body() body: { id: number; content: string }) {
    this.logger.log('/commentaires/update called');
    return await this.commentairesService.update(body.id, {
      contenu: body.content,
    });
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a commentaire by ID' })
  async deleteCommentaire(@Body() body: { id: number; userId: number }) {
    this.logger.log('/commentaires/delete called');

    // Vérifie que le commentaire existe
    const commentaire = await this.commentairesService.findOne(body.id);
    const user = await this.usersService.findOne(body.userId);

    if (!commentaire) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    // Vérifie que l'utilisateur est bien l'auteur
    if (user.idUtilisateur !== body.userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres commentaires',
      );
    }

    return await this.commentairesService.remove(body.id);
  }

  @Post('deleteAsAdmin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a commentaire by ID as an admin' })
  async deleteCommentaireAsAdmin(
    @Body() body: { id: number; adminId: number },
  ) {
    this.logger.log('/commentaires/deleteAsAdmin called');

    // Vérifie si l'utilisateur est administrateur
    const isAdmin = await this.usersService.isAdmin(body.adminId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Accès refusé : Vous devez être administrateur pour supprimer ce commentaire',
      );
    }

    // Vérifie que le commentaire existe
    const commentaire = await this.commentairesService.findOne(body.id);
    if (!commentaire) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    return await this.commentairesService.remove(body.id);
  }

  @Post('getByPublication')
  // @UseGuards(JwtAuthGuard) // Cette route est publique pour l’instant
  @ApiOperation({ summary: 'Get all commentaires for a specific publication' })
  @ApiResponse({
    status: 200,
    description: 'Commentaires retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async getCommentairesByPublication(@Body() body: { postId: number }) {
    this.logger.log(
      `/commentaires/getByPublication called for post ID: ${body.postId}`,
    );

    // Vérifie que la publication existe
    const publication = await this.publicationsService.findOne(body.postId);
    if (!publication) {
      throw new NotFoundException('Publication non trouvée');
    }

    return await this.commentairesService.findByPublication(body.postId);
  }
}
