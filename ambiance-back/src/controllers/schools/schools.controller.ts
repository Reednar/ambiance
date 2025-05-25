import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Req,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { SchoolsService } from '../../services/schools/schools.service';
import { School } from '../../entities/schools.entity';
import { UsersService } from '../../services/users/users.service';
import { MembresBDEService } from '../../services/membresBDE/membresBDE.service';
import { User } from 'src/entities/users.entity';
import { MembresBDE } from 'src/entities/membresBDE.entity';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';

@ApiTags('schools')
@Controller('schools')
export class SchoolsController {
  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly usersService: UsersService,
    private readonly membresBDEService: MembresBDEService,
    private readonly logger: Logger,
  ) {}

  /**
   * Mise à jour d'une école existante.
   * - Reçoit un id et un objet partiel avec les données à modifier.
   * - Convertit allowed_domain de tableau en chaîne délimitée par ';'.
   */
  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing school' })
  @ApiResponse({ status: 200, description: 'School updated successfully' })
  async updateSchool(
    @Body()
    body: { id: number; data: Partial<School> & { allowed_domain?: string[] } },
    @Req() req: Request,
  ): Promise<School> {
    const { id, data } = body;
    this.logger.log(
      `[${req.method} ${req.url}] Updating school with ID: ${id}`,
      data,
    );

    // Recherche de l'école par ID
    const school = await this.schoolsService.findOne(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Préparation des données de mise à jour
    const updateData: Partial<School> = { ...data };
    if (Array.isArray(data.allowed_domain)) {
      updateData.allowed_domain = data.allowed_domain.join(';');
    }

    // Mise à jour en base et retour de l'école modifiée
    return await this.schoolsService.update(id, updateData);
  }

  /**
   * Suppression d'une école par ID.
   * - Vérifie que l'école existe avant suppression.
   */
  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a school by ID' })
  @ApiResponse({ status: 200, description: 'School deleted successfully' })
  async deleteSchool(
    @Body() body: { id: number },
    @Req() req: Request,
  ): Promise<void> {
    const { id } = body;
    this.logger.log(
      `[${req.method} ${req.url}] Deleting school with ID: ${id}`,
    );

    const school = await this.schoolsService.findOne(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Suppression de l'école
    return await this.schoolsService.remove(id);
  }

  /**
   * Recherche d'une école par ID.
   * - Retourne aussi les allowed_domains sous forme de tableau.
   */
  @Post('find')
  @ApiOperation({ summary: 'Find a school by ID' })
  @ApiResponse({ status: 200, description: 'School found successfully' })
  async findSchool(
    @Body() body: { id: number },
    @Req() req: Request,
  ): Promise<any> {
    const { id } = body;
    this.logger.log(`[${req.method} ${req.url}] Finding school with ID: ${id}`);

    const school = await this.schoolsService.findOne(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Conversion de la chaîne allowed_domain en tableau
    const allowed_domains = this.schoolsService.splitAllowedDomain(
      (school as any).allowed_domain,
    );
    return {
      ...school,
      allowed_domains,
    };
  }

  /**
   * Récupération de toutes les écoles.
   */
  @Post('findAll')
  @ApiOperation({ summary: 'Find all schools' })
  @ApiResponse({ status: 200, description: 'Schools retrieved successfully' })
  async findAllSchools(@Req() req: Request): Promise<School[]> {
    this.logger.log(`[${req.method} ${req.url}] Finding all schools`);
    return await this.schoolsService.findAll();
  }

  /**
   * Création d'une nouvelle école protégée par JWT.
   * - Vérifie que l'utilisateur existe.
   * - Convertit allowed_domain en chaîne.
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new school ' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({
    description: 'Payload for creating a new school',
    examples: {
      example1: {
        value: {
          nom: 'École Test',
          site_web: 'https://ecole-test.com',
          telephone: '0123456789',
          description: 'Une école pour tester',
          contact_email: 'contact@ecole-test.com',
          type_ecole: 'publique',
          rue: '123 Rue de Test',
          ville: 'Paris',
          code_postal: '75000',
          image: 'url',
        },
      },
    },
  })
  async createSchoolProtected(
    @Body()
    body: {
      idUtilisateur: number;
      nom: string;
      site_web?: string;
      telephone?: string;
      description?: string;
      ville: string;
      codePostal: string;
      rue: string;
      contact_email: string;
      type_ecole: string;
      allowed_domain?: string[];
    },
    @Req() req: Request,
  ): Promise<School> {
    const { idUtilisateur, allowed_domain, ...schoolData } = body;

    this.logger.log(
      `[${req.method} ${req.url}] Creating a new school for user ID: ${idUtilisateur}`,
      schoolData,
    );

    // Recherche de l'utilisateur créateur
    const utilisateur = await this.usersService.findEntityById(idUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('User not found');
    }

    // Conversion de allowed_domain en chaîne délimitée par ';'
    let allowedDomainString: string | undefined = undefined;
    if (Array.isArray(allowed_domain)) {
      allowedDomainString = allowed_domain.join(';');
    }

    // Préparation de la nouvelle école avec le créateur
    const newSchool = {
      ...schoolData,
      allowed_domain: allowedDomainString,
      createur: utilisateur,
    } as Partial<School>;

    // Création de l'école en base
    return await this.schoolsService.create(newSchool);
  }

  /**
   * Ajout d'un membre au BDE en statut "pending".
   * - Vérifie que l'école et l'utilisateur existent.
   */
  @Post('addMember')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a member to the BDE (pending status)' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 404, description: 'School or user not found' })
  async addMemberToBDE(
    @Body() body: { idUtilisateur: number; idEcole: number; email: string },
    @Req() req: Request,
  ): Promise<void> {
    const { idUtilisateur, idEcole, email } = body;

    this.logger.log(`[${req.method} ${req.url}] Adding member to BDE`, body);

    // Vérification de l'existence de l'école
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérification de l'existence de l'utilisateur
    const utilisateur = await this.usersService.findOne(idUtilisateur);
    if (!utilisateur) {
      throw new NotFoundException('User not found');
    }

    // Ajout du membre avec statut "pending"
    await this.membresBDEService.addMember({
      idUtilisateur,
      idEcole,
      email,
      status: 'pending',
    });
  }

  /**
   * Récupération des membres BDE en attente pour une école donnée.
   * - Vérifie que le créateur correspond bien à l'école.
   */
  @Post('getPendingMembers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get pending BDE members for a school' })
  @ApiResponse({
    status: 200,
    description: 'Pending members retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'School or creator not found' })
  async getPendingMembers(
    @Body() body: { idEcole: number; idCreateur: number },
    @Req() req: Request,
  ): Promise<any[]> {
    const { idEcole, idCreateur } = body;

    this.logger.log(
      `[${req.method} ${req.url}] Fetching pending members for school ID: ${idEcole}`,
      body,
    );

    // Vérification que le créateur existe
    const creator = await this.usersService.findOne(idCreateur);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Vérification que l'école existe et appartient bien au créateur
    const school = await this.schoolsService.findOne(idEcole);
    if (!school || school.createur.idUtilisateur !== idCreateur) {
      throw new NotFoundException('School not found or unauthorized');
    }

    // Récupération des membres BDE en statut pending
    return await this.membresBDEService.findPendingMembersBySchool(idEcole);
  }
  @Post('updateMemberStatus')
  @UseGuards(JwtAuthGuard) // Protection avec JWT : l'utilisateur doit être authentifié
  @ApiOperation({ summary: 'Update the status of a BDE member to verified' })
  @ApiResponse({
    status: 200,
    description: 'Member status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'School, creator, or member not found',
  })
  async updateMemberStatus(
    @Body()
    body: { idEcole: number; idCreateur: number; idUtilisateur: number },
    @Req() req: Request,
  ): Promise<void> {
    const { idEcole, idCreateur, idUtilisateur } = body;

    this.logger.log(
      `[${req.method} ${req.url}] Updating member status to verified`,
      body,
    );

    // Vérification que le créateur existe
    const creator = await this.usersService.findOne(idCreateur);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Récupération de l'école avec son créateur
    const school = await this.schoolsService.findOneWithCreator(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérification que le créateur correspond bien à l'école
    if (school.createur?.idUtilisateur !== idCreateur) {
      throw new NotFoundException('Creator does not match the school');
    }

    // Vérification que le membre existe dans cette école
    const member = await this.membresBDEService.findMemberBySchoolAndUser(
      idEcole,
      idUtilisateur,
    );
    if (!member) {
      throw new NotFoundException('Member not found in this school');
    }

    // Mise à jour du statut du membre à "verified"
    await this.membresBDEService.updateMemberStatus(
      idEcole,
      idUtilisateur,
      'verified',
    );
  }

  @Post('removeMember')
  @UseGuards(JwtAuthGuard) // Protection JWT
  @ApiOperation({ summary: 'Remove a member from the BDE' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({
    status: 404,
    description: 'School, creator, or member not found',
  })
  async removeMemberFromBDE(
    @Body()
    body: { idEcole: number; idCreateur: number; idUtilisateur: number },
    @Req() req: Request,
  ): Promise<void> {
    const { idEcole, idCreateur, idUtilisateur } = body;

    this.logger.log(
      `[${req.method} ${req.url}] Removing member from BDE`,
      body,
    );

    // Vérification du créateur
    const creator = await this.usersService.findOne(idCreateur);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Récupération de l'école avec son créateur
    const school = await this.schoolsService.findOneWithCreator(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérification de la correspondance créateur-école
    if (school.createur?.idUtilisateur !== idCreateur) {
      throw new NotFoundException('Creator does not match the school');
    }

    // Vérification que le membre existe dans cette école
    const member = await this.membresBDEService.findMemberBySchoolAndUser(
      idEcole,
      idUtilisateur,
    );
    if (!member) {
      throw new NotFoundException('Member not found in this school');
    }

    // Suppression du membre du BDE
    await this.membresBDEService.removeMember(idEcole, idUtilisateur);
  }

  @Post('getUsersBySchool')
  @UseGuards(JwtAuthGuard) // Protection JWT
  @ApiOperation({ summary: 'Get all users attached to a school' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getUsersBySchool(
    @Body() body: { idEcole: number },
    @Req() req: Request,
  ): Promise<User[]> {
    const { idEcole } = body;

    this.logger.log(
      `[${req.method} ${req.url}] Fetching users for school ID: ${idEcole}`,
    );

    // Vérification que l'école existe
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Récupération des utilisateurs liés à l'école
    const users = await this.usersService.findUsersBySchool(idEcole);
    return users;
  }

  @Post('getMembersBySchool')
  @UseGuards(JwtAuthGuard) // Protection JWT
  @ApiOperation({ summary: 'Get all BDE members for a school' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getMembersBySchool(
    @Body() body: { idEcole: number },
    @Req() req: Request,
  ): Promise<MembresBDE[]> {
    const { idEcole } = body;

    this.logger.log(
      `[${req.method} ${req.url}] Fetching BDE members for school ID: ${idEcole}`,
    );

    // Vérification que l'école existe
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Récupération des membres BDE liés à l'école
    const members = await this.membresBDEService.findMembersBySchool(idEcole);
    return members;
  }

  @Post('changeCreator')
  @UseGuards(JwtAuthGuard) // Protection JWT
  @ApiOperation({ summary: 'Change the creator of a school' })
  @ApiResponse({
    status: 200,
    description: 'School creator changed successfully',
  })
  @ApiResponse({ status: 404, description: 'School or user not found' })
  async changeSchoolCreator(
    @Body() body: { idEcole: number; newCreatorId: number },
    @Req() req: Request,
  ): Promise<School> {
    const { idEcole, newCreatorId } = body;

    this.logger.log(
      `[${req.method} ${req.url}] Changing creator for school ID: ${idEcole} to user ID: ${newCreatorId}`,
    );

    // Vérification que l'école existe
    const school = await this.schoolsService.findOne(idEcole);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Vérification que le nouvel utilisateur créateur existe
    const newCreator = await this.usersService.findEntityById(newCreatorId);
    if (!newCreator) {
      throw new NotFoundException('New creator user not found');
    }

    // Mise à jour du créateur de l'école
    const updatedSchool = await this.schoolsService.update(idEcole, {
      createur: newCreator,
    });
    return updatedSchool;
  }

  // POST /schools/by-user
  // Récupère l'école associée à un utilisateur via son ID
  @Post('by-user')
  async findByUserId(@Body('userId') userId: number): Promise<School> {
    const school = await this.schoolsService.findByUserId(userId);
    if (!school) {
      throw new NotFoundException(
        `École pour l'utilisateur ${userId} non trouvée`,
      );
    }
    return school;
  }
}
