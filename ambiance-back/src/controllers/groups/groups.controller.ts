import { Controller, Get, Post, Delete, Body, UseGuards, NotFoundException, Logger, Param, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupsService } from '../../services/groups/groups.service';
import { UsersService } from '../../services/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { PublicationsService } from '../../services/publications/publications.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(
    private GroupsService: GroupsService,
    private UsersService: UsersService,
    private PublicationsService: PublicationsService,
    private readonly logger: Logger, // Injection du logger
  ) {}


  @Post('findAll')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Return all groups if the requester is an admin' })
  async getGroupes(@Body() body: { userId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching all groups`, body.userId); // Log de la requête
    // Vérification si l'utilisateur est administrateur
    const utilisateur = await this.UsersService.findOne(body.userId);
    if (!utilisateur || utilisateur.role !== 'Administrateur') {
      throw new NotFoundException('Accès refusé : Seuls les administrateurs peuvent accéder à cette ressource.');
    }

    // Retourne tous les groupes si l'utilisateur est administrateur
    return await this.GroupsService.findAll();
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a group and add the user who created the group' })
  async createGroup(@Body() body: { nomDuGroupe: string; utilisateurId: number; idPublication: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Creating a new group`, body);// Log de la requête
    const utilisateur = await this.UsersService.findOne(body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const publication = await this.PublicationsService.findOne(body.idPublication);
    if (!publication) {
      throw new NotFoundException('Publication non trouvée');
    }

    const newGroup = await this.GroupsService.create({
      nomDuGroupe: body.nomDuGroupe,
      publication,
      utilisateur, // <-- Ajoute l'organisateur ici
    });
    // Add the user to the created group
    await this.GroupsService.addUserToGroup(newGroup.idGroupe, utilisateur.idUtilisateur);
    return newGroup;
  }

  @Post("addUser")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a user to a group by publication' })
  async addUserToGroup(
    @Body() body: { idPublication: number; IdUtilisateur: number },
    @Req() req: Request
  ) {
    this.logger.log(`[${req.method} ${req.url}] Adding user to group by publication`, body);

    // Trouver le groupe lié à la publication
    const groupe = await this.GroupsService.getGroupeByPublicationId(body.idPublication);
    if (!groupe) {
      throw new NotFoundException('Groupe lié à la publication non trouvé');
    }

    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const participation = {
      idGroupe: groupe,
      idUtilisateur: utilisateur,
    };
    await this.GroupsService.addParticipation(participation);

    return { message: 'Participation added' };
  }

  @Post("removeUser")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a user from a group' })
  async removeUserFromGroup(@Body() body: { IdGroupe: number; IdUtilisateur: number; senderId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Removing user from group`, body);
    // Vérification si le groupe existe
    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    // Vérification si l'utilisateur à supprimer existe
    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérification si le sender est l'organisateur du groupe
    const sender = await this.UsersService.findOne(body.senderId);
    if (!sender) {
      throw new NotFoundException('Utilisateur (sender) non trouvé');
    }

    const isOrganisateur = await this.GroupsService.isOrganisateur(body.IdGroupe, body.senderId);
    if (!isOrganisateur) {
      throw new NotFoundException('Accès refusé : Seul l\'organisateur du groupe peut supprimer un utilisateur.');
    }

    // Suppression de l'utilisateur du groupe
    await this.GroupsService.removeUserFromGroup(body.IdGroupe, body.IdUtilisateur);

    return { message: 'User removed from group' };
  }

  @Post("changeOrganisateur")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change the organisateur of a group' })
  async changeOrganisateur(@Body() body: { IdGroupe: number; IdUtilisateur: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Changing group organisateur`, body); // Log de la requête
    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.GroupsService.changeOrganisateur(body.IdGroupe, body.IdUtilisateur);

    return { message: 'Organisateur changed' };
  }
  
  @Post("userGroups")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get groups where the user participates' })
  async getUserGroups(@Body() body: { IdUtilisateur: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching groups for user`, body.IdUtilisateur);
    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return await this.GroupsService.findGroupsByUser(body.IdUtilisateur);
  }

  @Post("groupUsers")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get users in a specific group' })
  async getUsersInGroup(@Body() body: { IdGroupe: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching users in group`, body.IdGroupe); 
    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    return await this.GroupsService.findUsersByGroup(body.IdGroupe);
  }
}


