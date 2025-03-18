import { Controller, Get, Post, Delete, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupsService } from '../../services/groups/groups.service';
import { UsersService } from '../../services/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { PublicationsService } from '../../services/publications/publications.service';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(
    private GroupsService: GroupsService,
    private UsersService: UsersService,
    private PublicationsService: PublicationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Return all groups' })
  async getGroupes() {
    return await this.GroupsService.findAll();
  }

  @Post("create")
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a group and add the user who created the group' })
  async createGroup(@Body() body: { nomDuGroupe: string; utilisateurId: number; idPublication: number }) {
    const utilisateur = await this.UsersService.findOne(body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const publication = await this.PublicationsService.findOne(body.idPublication);
    if (!publication) {
      throw new NotFoundException('Publication non trouvée');
    }

    const newGroup = await this.GroupsService.create({ nomDuGroupe: body.nomDuGroupe, publication });
    // Add the user to the created group
    await this.GroupsService.addUserToGroup(newGroup.idGroupe, utilisateur.idUtilisateur);
    return newGroup;
  }

  @Post("addUser")
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a participation' })
  async addUserToGroup(@Body() body: { IdGroupe: number; IdUtilisateur: number }) {
    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const participation = {
      idGroupe: groupe,
      idUtilisateur: utilisateur,
      Organisateur: 0
    };
    await this.GroupsService.addParticipation(participation);

    return { message: 'Participation added' };
  }

  @Post("removeUser")
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remove a user from a group' })
  async removeUserFromGroup(@Body() body: { IdGroupe: number; IdUtilisateur: number }) {
    const groupe = await this.GroupsService.findOne(body.IdGroupe);
    if (!groupe) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.GroupsService.removeUserFromGroup(body.IdGroupe, body.IdUtilisateur);

    return { message: 'User removed from group' };
  }

  @Post("changeOrganisateur")
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Change the organisateur of a group' })
  async changeOrganisateur(@Body() body: { IdGroupe: number; IdUtilisateur: number }) {
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get groups where the user participates' })
  async getUserGroups(@Body() body: { IdUtilisateur: number }) {
    const utilisateur = await this.UsersService.findOne(body.IdUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return await this.GroupsService.findGroupsByUser(body.IdUtilisateur);
  }
}


