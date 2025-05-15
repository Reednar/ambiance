import { Controller, Post, Body, NotFoundException, Req, Logger, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { SchoolsService } from '../../services/schools/schools.service';
import { School } from '../../entities/schools.entity';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service';
import { MembresBDEService } from '../../services/membresBDE/membresBDE.service'; // Assurez-vous que ce service existe
import { User } from 'src/entities/users.entity';
import { MembresBDE } from 'src/entities/membresBDE.entity';

@ApiTags('schools')
@Controller('schools')
export class SchoolsController {
  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly usersService: UsersService,
    private readonly membresBDEService: MembresBDEService, // Injecter le service MembresBDE
    private readonly logger: Logger,
  ) {}

  /*@Post('create')
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  async createSchool(@Body() body: Partial<School>, @Req() req: Request): Promise<School> {
    this.logger.log(`[${req.method} ${req.url}] Creating a new school`, body);
    return await this.schoolsService.create(body);
  }*/

  @Post('update')
  @ApiOperation({ summary: 'Update an existing school' })
  @ApiResponse({ status: 200, description: 'School updated successfully' })
  async updateSchool(@Body() body: { id: number; data: Partial<School> }, @Req() req: Request): Promise<School> {
    const { id, data } = body;
    this.logger.log(`[${req.method} ${req.url}] Updating school with ID: ${id}`, data);
    const school = await this.schoolsService.findOne(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return await this.schoolsService.update(id, data);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete a school by ID' })
  @ApiResponse({ status: 200, description: 'School deleted successfully' })
  async deleteSchool(@Body() body: { id: number }, @Req() req: Request): Promise<void> {
    const { id } = body;
    this.logger.log(`[${req.method} ${req.url}] Deleting school with ID: ${id}`);
    const school = await this.schoolsService.findOne(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return await this.schoolsService.remove(id);
  }

  @Post('find')
  @ApiOperation({ summary: 'Find a school by ID' })
  @ApiResponse({ status: 200, description: 'School found successfully' })
  async findSchool(@Body() body: { id: number }, @Req() req: Request): Promise<School> {
    const { id } = body;
    this.logger.log(`[${req.method} ${req.url}] Finding school with ID: ${id}`);
    const school = await this.schoolsService.findOne(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }

  @Post('findAll')
  @ApiOperation({ summary: 'Find all schools' })
  @ApiResponse({ status: 200, description: 'Schools retrieved successfully' })
  async findAllSchools(@Req() req: Request): Promise<School[]> {
    this.logger.log(`[${req.method} ${req.url}] Finding all schools`);
    return await this.schoolsService.findAll();
  }

  @Post('create')
  //@UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new school ' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody(
  {
    description: 'Payload for creating a new school',
    examples: {
      example1: {
        value: {
          nom: "École Test",
          site_web: "https://ecole-test.com",
          telephone: "0123456789",
          description: "Une école pour tester",
          contact_email: "contact@ecole-test.com",
          type_ecole: "publique",
          rue: "123 Rue de Test",
          ville: "Paris",
          code_postal: "75000"
        }
      }
    }
  })
  async createSchoolProtected(
    @Body() body: { idUtilisateur: number; nom: string; site_web?: string; telephone?: string; description?: string; ville: string; codePostal: string; rue: string,contact_email: string; type_ecole: string },
    @Req() req: Request,
  ): Promise<School> {
    const { idUtilisateur, ...schoolData } = body;

    this.logger.log(`[${req.method} ${req.url}] Creating a new school for user ID: ${idUtilisateur}`, schoolData);

    // Vérifier si l'utilisateur existe
    const utilisateur = await this.usersService.findOne(idUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('User not found');
    }

    // Ajouter l'utilisateur comme créateur de l'école
    const newSchool = {
      ...schoolData,
      createur: utilisateur,
    } as Partial<School>;

    return await this.schoolsService.create(newSchool);
  }

  @Post('addMember')
  //@UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a member to the BDE (pending status)' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 404, description: 'School or user not found' })
  async addMemberToBDE(
    @Body() body: { idUtilisateur: number; idEcole: number; email: string },
    @Req() req: Request,
  ): Promise<void> {
    const { idUtilisateur, idEcole, email } = body;

    this.logger.log(`[${req.method} ${req.url}] Adding member to BDE`, body);

    // Vérifier si l'école existe
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérifier si l'utilisateur existe
    const utilisateur = await this.usersService.findOne(idUtilisateur); // Remplacez par la méthode appropriée
    if (!utilisateur) {
      throw new NotFoundException('User not found');
    }

    // Ajouter le membre à la table MembresBDE avec le statut "pending"
    await this.membresBDEService.addMember({
      idUtilisateur,
      idEcole,
      email,
      status: 'pending',
    });
  }

  @Post('getPendingMembers')
  //@UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get pending BDE members for a school' })
  @ApiResponse({ status: 200, description: 'Pending members retrieved successfully' })
  @ApiResponse({ status: 404, description: 'School or creator not found' })
  async getPendingMembers(
    @Body() body: { idEcole: number; idCreateur: number },
    @Req() req: Request,
  ): Promise<any[]> {
    const { idEcole, idCreateur } = body;

    this.logger.log(`[${req.method} ${req.url}] Fetching pending members for school ID: ${idEcole}`, body);

    // Vérifier si l'utilisateur créateur existe
    const creator = await this.usersService.findOne(idCreateur);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Vérifier si l'école existe
    const school = await this.schoolsService.findOneWithCreator(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérifier si l'utilisateur est bien le créateur de l'école
    
    if (school.createur?.idUtilisateur !== idCreateur) {
      throw new NotFoundException('Creator does not match the school');
    }

    // Récupérer les membres en statut "pending"
    const pendingMembers = await this.membresBDEService.findPendingMembersBySchool(idEcole);

    return pendingMembers;
  }

  @Post('updateMemberStatus')
  //@UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update the status of a BDE member to verified' })
  @ApiResponse({ status: 200, description: 'Member status updated successfully' })
  @ApiResponse({ status: 404, description: 'School, creator, or member not found' })
  async updateMemberStatus(
    @Body() body: { idEcole: number; idCreateur: number; idUtilisateur: number },
    @Req() req: Request,
  ): Promise<void> {
    const { idEcole, idCreateur, idUtilisateur } = body;

    this.logger.log(`[${req.method} ${req.url}] Updating member status to verified`, body);

    // Vérifier si l'utilisateur créateur existe
    const creator = await this.usersService.findOne(idCreateur);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Vérifier si l'école existe
    const school = await this.schoolsService.findOneWithCreator(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérifier si l'utilisateur est bien le créateur de l'école
    if (school.createur?.idUtilisateur !== idCreateur) {
      throw new NotFoundException('Creator does not match the school');
    }

    // Vérifier si le membre existe dans la table MembresBDE
    const member = await this.membresBDEService.findMemberBySchoolAndUser(idEcole, idUtilisateur);
    if (!member) {
      throw new NotFoundException('Member not found in this school');
    }

    // Mettre à jour le statut du membre en "verified"
    await this.membresBDEService.updateMemberStatus(idEcole, idUtilisateur, 'verified');
  }

  @Post('removeMember')
  //@UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remove a member from the BDE' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'School, creator, or member not found' })
  async removeMemberFromBDE(
    @Body() body: { idEcole: number; idCreateur: number; idUtilisateur: number },
    @Req() req: Request,
  ): Promise<void> {
    const { idEcole, idCreateur, idUtilisateur } = body;

    this.logger.log(`[${req.method} ${req.url}] Removing member from BDE`, body);

    // Vérifier si l'utilisateur créateur existe
    const creator = await this.usersService.findOne(idCreateur);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Vérifier si l'école existe
    const school = await this.schoolsService.findOneWithCreator(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérifier si l'utilisateur est bien le créateur de l'école
    if (school.createur?.idUtilisateur !== idCreateur) {
      throw new NotFoundException('Creator does not match the school');
    }

    // Vérifier si le membre existe dans la table MembresBDE
    const member = await this.membresBDEService.findMemberBySchoolAndUser(idEcole, idUtilisateur);
    if (!member) {
      throw new NotFoundException('Member not found in this school');
    }

    // Supprimer le membre de la table MembresBDE
    await this.membresBDEService.removeMember(idEcole, idUtilisateur);
  }

  @Post('getUsersBySchool')
  //@UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all users attached to a school' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getUsersBySchool(
    @Body() body: { idEcole: number },
    @Req() req: Request,
  ): Promise<User[]> {
    const { idEcole } = body;

    this.logger.log(`[${req.method} ${req.url}] Fetching users for school ID: ${idEcole}`);

    // Vérifier si l'école existe
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Récupérer les utilisateurs rattachés à l'école
    const users = await this.usersService.findUsersBySchool(idEcole);
    return users;
  }

  @Post('getMembersBySchool')
  //@UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all BDE members for a school' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getMembersBySchool(
    @Body() body: { idEcole: number },
    @Req() req: Request,
  ): Promise<MembresBDE[]> {
    const { idEcole } = body;

    this.logger.log(`[${req.method} ${req.url}] Fetching BDE members for school ID: ${idEcole}`);

    // Vérifier si l'école existe
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Récupérer les membres du BDE pour l'école
    const members = await this.membresBDEService.findMembersBySchool(idEcole);
    return members;
  }

  @Post('changeCreator')
  @ApiOperation({ summary: 'Change the creator of a school' })
  @ApiResponse({ status: 200, description: 'School creator changed successfully' })
  @ApiResponse({ status: 404, description: 'School or user not found' })
  async changeSchoolCreator(
    @Body() body: { idEcole: number; newCreatorId: number },
    @Req() req: Request,
  ): Promise<School> {
    const { idEcole, newCreatorId } = body;

    this.logger.log(`[${req.method} ${req.url}] Changing creator for school ID: ${idEcole} to user ID: ${newCreatorId}`);

    // Vérifier si l'école existe
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérifier si le nouvel utilisateur existe
    const newCreator = await this.usersService.findOne(newCreatorId);
    if (!newCreator) {
      throw new NotFoundException('New creator user not found');
    }

    // Mettre à jour le créateur de l'école
    const updatedSchool = await this.schoolsService.update(idEcole, { createur: newCreator });
    return updatedSchool;
  }
}
