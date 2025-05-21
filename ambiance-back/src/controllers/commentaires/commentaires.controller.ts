import { Controller, Post, Body, Param, UseGuards, NotFoundException, ForbiddenException,Logger } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CommentairesService } from '../../services/commentaires/commentaires.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service'; 
import { PublicationsService } from 'src/services/publications/publications.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';


@ApiTags('commentaires')
@Controller('commentaires')
export class CommentairesController {
  constructor(
    private commentairesService: CommentairesService,
    private usersService: UsersService, // Injection correcte
    private publicationsService: PublicationsService, // Injection correcte
    private readonly logger: Logger, // Injection correcte
  ) {}

  @Post('findAll')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Return all commentaires' })
  async getCommentaires() {
    this.logger.log('/commentaires/findAll called');
    return await this.commentairesService.findAll();
  }

  @Post('findOne')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find a commentaire by ID' })
  async getCommentaire(@Body() body: { id: number }) {
    this.logger.log('/commentaires/findOne called');
    return await this.commentairesService.findOne(body.id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new commentaire' })
  async createCommentaire(@Body() body: { content: string; userId: number; postId: number }) {
    this.logger.log('/commentaires/create called'); 
    const user = await this.usersService.findOne(body.userId); // Utilisation correcte
    const post = await this.publicationsService.findOne(body.postId); // Utilisation correcte
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
    return await this.commentairesService.update(body.id, { contenu: body.content });
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a commentaire by ID' })
  async deleteCommentaire(@Body() body: { id: number; userId: number }) {
    this.logger.log('/commentaires/delete called');
    const commentaire = await this.commentairesService.findOne(body.id);
    const user = await this.usersService.findOne(body.userId); // Utilisation correcte
    if (!commentaire) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    // Vérification si l'utilisateur est l'auteur du commentaire
    if (user.idUtilisateur !== body.userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres commentaires');
    }

    return await this.commentairesService.remove(body.id);
  }

  @Post('deleteAsAdmin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a commentaire by ID as an admin' })
  async deleteCommentaireAsAdmin(@Body() body: { id: number; adminId: number }) {
    this.logger.log('/commentaires/deleteAsAdmin called');
    const isAdmin = await this.usersService.isAdmin(body.adminId);

    if (!isAdmin) {
      throw new ForbiddenException('Accès refusé : Vous devez être administrateur pour supprimer ce commentaire');
    }

    const commentaire = await this.commentairesService.findOne(body.id);

    if (!commentaire) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    return await this.commentairesService.remove(body.id);
  }

  @Post('getByPublication')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all commentaires for a specific publication' })
  @ApiResponse({ status: 200, description: 'Commentaires retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async getCommentairesByPublication(@Body() body: { postId: number }) {
    this.logger.log(`/commentaires/getByPublication called for post ID: ${body.postId}`);

    // Vérifier si la publication existe
    const publication = await this.publicationsService.findOne(body.postId);
    if (!publication) {
      throw new NotFoundException('Publication non trouvée');
    }

    // Récupérer les commentaires liés à la publication
    return await this.commentairesService.findByPublication(body.postId);
  }
}
