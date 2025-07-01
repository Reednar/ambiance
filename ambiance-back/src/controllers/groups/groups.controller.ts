import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  NotFoundException,
  Logger,
  Param,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupsService } from '../../services/groups/groups.service';
import { UsersService } from '../../services/users/users.service';
import { PublicationsService } from '../../services/publications/publications.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(
    private GroupsService: GroupsService,
    private UsersService: UsersService,
    private PublicationsService: PublicationsService,
    private readonly logger: Logger,
  ) {}

  /**
   * Retourne tous les groupes si l'utilisateur est administrateur
   */
  @Post('findAll')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Return all groups if the requester is an admin' })
  async getGroupes(@Body() body: { userId: number }, @Req() req: Request) {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Fetching all groups`,
      { userId: body.userId }
    );

    const utilisateur = await this.UsersService.findOne(body.userId);
    if (!utilisateur || utilisateur.role !== 'Administrateur') {
      this.logger.warn(
        `[WARN] [${req.method} ${req.url}] Access denied - User not admin`,
        { userId: body.userId, userRole: utilisateur?.role || 'not_found' }
      );
      throw new NotFoundException(
        'Accès refusé : Seuls les administrateurs peuvent accéder à cette ressource.',
      );
    }

    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Groups fetched successfully`,
      { requestedBy: body.userId }
    );
    return await this.GroupsService.findAll();
  }

  /**
   * Crée un groupe et ajoute le créateur comme membre
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a group and add the user who created the group',
  })
  async createGroup(
    @Body()
    body: { nomDuGroupe: string; utilisateurId: number; idPublication: number },
    @Req() req: Request,
  ) {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Creating a new group`,
      { 
        groupName: body.nomDuGroupe,
        userId: body.utilisateurId,
        publicationId: body.idPublication
      }
    );

    const utilisateur = await this.UsersService.findEntityById(
      body.utilisateurId,
    );
    if (!utilisateur) {
      this.logger.error(
        `[ERROR] [${req.method} ${req.url}] User not found for group creation`,
        { userId: body.utilisateurId }
      );
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const publication = await this.PublicationsService.findOne(
      body.idPublication,
    );
    if (!publication) {
      throw new NotFoundException('Publication non trouvée');
    }

    const newGroup = await this.GroupsService.create({
      nomDuGroupe: body.nomDuGroupe,
      publication,
      utilisateur,
    });

    await this.GroupsService.addUserToGroup(
      newGroup.idGroupe,
      utilisateur.idUtilisateur,
    );
    return newGroup;
  }

  /**
   * Ajoute un utilisateur à un groupe en fonction de la publication
   */
  @Post('addUser')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a user to a group by publication' })
  async addUserToGroup(
    @Body() body: { idPublication: number; idUtilisateur: number },
    @Req() req: Request,
  ) {
    this.logger.log(
      `[${req.method} ${req.url}] Adding user to group by publication`,
      body,
    );

    console.log(
      'iduser : ' + body.idUtilisateur + ' et iud pub = ' + body.idPublication,
    );
    const groupe = await this.GroupsService.getGroupeByPublicationId(
      body.idPublication,
    );
    if (!groupe) {
      throw new NotFoundException('Groupe lié à la publication non trouvé');
    }

    const utilisateur = await this.UsersService.findEntityById(
      body.idUtilisateur,
    );
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.GroupsService.addParticipation({
      idGroupe: groupe,
      idUtilisateur: utilisateur,
    });

    return { message: 'Participation ajoutée' };
  }

  /**
   * Supprime un utilisateur d’un groupe (seul l’organisateur peut le faire)
   */
  @Post('removeUser')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a user from a group' })
  async removeUserFromGroup(
    @Body() body: { IdGroupe: number; IdUtilisateur: number; senderId: number },
    @Req() req: Request,
  ) {
    this.logger.log(
      `[${req.method} ${req.url}] Removing user from group`,
      body,
    );

    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const sender = await this.UsersService.findOne(body.senderId);
    if (!sender) {
      throw new NotFoundException('Utilisateur (sender) non trouvé');
    }

    const isOrganisateur = await this.GroupsService.isOrganisateur(
      body.IdGroupe,
      body.senderId,
    );
    if (!isOrganisateur) {
      throw new NotFoundException(
        "Accès refusé : Seul l'organisateur du groupe peut supprimer un utilisateur.",
      );
    }

    await this.GroupsService.removeUserFromGroup(
      body.IdGroupe,
      body.IdUtilisateur,
    );
    return { message: 'Utilisateur retiré du groupe' };
  }

  /**
   * Change l’organisateur d’un groupe
   */
  @Post('changeOrganisateur')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change the organisateur of a group' })
  async changeOrganisateur(
    @Body() body: { IdGroupe: number; IdUtilisateur: number },
    @Req() req: Request,
  ) {
    this.logger.log(
      `[${req.method} ${req.url}] Changing group organisateur`,
      body,
    );

    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.GroupsService.changeOrganisateur(
      body.IdGroupe,
      body.IdUtilisateur,
    );
    return { message: 'Organisateur modifié' };
  }

  /**
   * Retourne les groupes auxquels un utilisateur participe
   */
  @Post('userGroups')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get groups where the user participates' })
  async getUserGroups(
    @Body() body: { IdUtilisateur: number },
    @Req() req: Request,
  ) {
    this.logger.log(
      `[${req.method} ${req.url}] Fetching groups for user`,
      body.IdUtilisateur,
    );

    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return await this.GroupsService.findGroupsByUser(body.IdUtilisateur);
  }

  /**
   * Retourne la liste des utilisateurs d’un groupe
   */
  @Post('groupUsers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get users in a specific group' })
  async getUsersInGroup(
    @Body() body: { IdGroupe: number },
    @Req() req: Request,
  ) {
    this.logger.log(
      `[${req.method} ${req.url}] Fetching users in group`,
      body.IdGroupe,
    );

    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    return await this.GroupsService.findUsersByGroup(body.IdGroupe);
  }

  @Post('has-joined')
  async hasUserJoinedPublicationGroup(
    @Body()
    body: {
      idUtilisateur: number;
      idPublication: number;
    },
  ): Promise<{ hasJoined: boolean }> {
    const { idUtilisateur, idPublication } = body;
    console.log(idUtilisateur + ' ' + idPublication);
    const hasJoined = await this.GroupsService.hasUserJoinedPublicationGroup(
      idUtilisateur,
      idPublication,
    );
    return { hasJoined };
  }
}
