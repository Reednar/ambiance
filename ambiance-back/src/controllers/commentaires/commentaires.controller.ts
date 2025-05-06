import { Controller, Post, Body, Param, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentairesService } from '../../services/commentaires/commentaires.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service'; 
import { PublicationsService } from 'src/services/publications/publications.service';

@ApiTags('commentaires')
@Controller('commentaires')
export class CommentairesController {
  constructor(
    private commentairesService: CommentairesService,
    private usersService: UsersService, // Injection correcte
    private publicationsService: PublicationsService, // Injection correcte
  ) {}

  @Post('findAll')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Return all commentaires' })
  async getCommentaires() {
    return await this.commentairesService.findAll();
  }

  @Post('findOne')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Find a commentaire by ID' })
  async getCommentaire(@Body() body: { id: number }) {
    return await this.commentairesService.findOne(body.id);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new commentaire' })
  async createCommentaire(@Body() body: { content: string; userId: number; postId: number }) {
    const user = await this.usersService.findOne(body.userId); // Utilisation correcte
    const post = await this.publicationsService.findOne(body.postId); // Utilisation correcte
    return await this.commentairesService.create({
      contenu: body.content,
      idUtilisateur: user,
      idPublication: post,
    });
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update an existing commentaire' })
  async updateCommentaire(@Body() body: { id: number; content: string }) {
    return await this.commentairesService.update(body.id, { contenu: body.content });
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a commentaire by ID' })
  async deleteCommentaire(@Body() body: { id: number; userId: number }) {
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a commentaire by ID as an admin' })
  async deleteCommentaireAsAdmin(@Body() body: { id: number; adminId: number }) {
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
}
