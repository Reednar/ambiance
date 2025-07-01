import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  UseGuards,
  Body,
  Req,
  Logger,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicationsService } from '../../services/publications/publications.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicationDto } from 'src/dtos/publications.dto';
import { PublicationCategoriesService } from 'src/services/publication-categories/publication-categories.service';
import { GroupsService } from 'src/services/groups/groups.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { School } from 'src/entities/schools.entity';
import { SchoolsService } from 'src/services/schools/schools.service';
import { UserDto } from 'src/dtos/user.dto';
import { DiscussionService } from 'src/services/discussion/discussion.service';

@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(
    private publicationsService: PublicationsService,
    private readonly usersService: UsersService,
    private publicationCategoriesService: PublicationCategoriesService,
    private groupsService: GroupsService,
    private readonly logger: Logger,
    private readonly schoolsService: SchoolsService,
    private readonly discussionService: DiscussionService,
  ) {}

  @Get('test') //endpoint (endpoit ALWAYS before controller endpoint)
  @UseGuards(JwtAuthGuard) //protected request
  getProtectedData() {
    this.logger.log('[INFO] Test endpoint accessed successfully');
    return { message: 'Accès autorisé à la route protégée.' };
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async deletePublication(
    @Body() Body: { idPublication: number; utilisateurId: number },
    @Req() req: Request,
  ) {
    try {
      this.logger.log(`[INFO] Deleting publication - publicationId: ${Body.idPublication}, userId: ${Body.utilisateurId}`);

      const utilisateur = await this.usersService.findOne(Body.utilisateurId);
      if (!utilisateur) {
        this.logger.warn(`[WARN] User not found for publication deletion - userId: ${Body.utilisateurId}`);
        throw new NotFoundException('Utilisateur non trouvé');
      }
      
      const publication = await this.publicationsService.findOne(Body.idPublication);
      if (!publication) {
        this.logger.warn(`[WARN] Publication not found for deletion - publicationId: ${Body.idPublication}`);
        throw new NotFoundException('publication not found');
      }

      if (utilisateur.role != 'Administrateur') {
        if (publication.utilisateurId !== utilisateur.idUtilisateur) {
          this.logger.warn(`[WARN] User not authorized to delete publication - userId: ${Body.utilisateurId}, publicationId: ${Body.idPublication}`);
          throw new NotFoundException('Utilisateur non autorisé à supprimer ce publication');
        }
      }

      // 1. Récupérer le groupe lié à la publication
      const groupe = await this.groupsService.getGroupeByPublicationId(publication.idPublication);

      if (groupe) {
        // 2. Supprimer la discussion liée au groupe s'il en existe une
        const discussion = await this.discussionService.findByGroupId(groupe.idGroupe);
        if (discussion) {
          await this.discussionService.remove(discussion.idDiscussion);
          this.logger.log(`[INFO] Discussion removed successfully - discussionId: ${discussion.idDiscussion}, groupId: ${groupe.idGroupe}`);
        }

        // 3. Supprimer toutes les participations liées à ce groupe
        if (groupe.participations && groupe.participations.length > 0) {
          this.logger.log(`[INFO] Removing ${groupe.participations.length} participations from group - groupId: ${groupe.idGroupe}`);
          for (const participation of groupe.participations) {
            await this.groupsService.removeUserFromGroup(
              groupe.idGroupe,
              participation.idUtilisateur.idUtilisateur,
            );
          }
        }
        // 4. Supprimer le groupe
        await this.groupsService.remove(groupe.idGroupe);
        this.logger.log(`[INFO] Group removed successfully - groupId: ${groupe.idGroupe}`);
      }

      // 5. Supprimer la publication
      await this.publicationsService.remove(publication.idPublication);
      this.logger.log(`[INFO] Publication deleted successfully - publicationId: ${Body.idPublication}, userId: ${Body.utilisateurId}`);

      return {
        message: 'Publication, groupe, discussion et participations supprimés avec succès',
      };
    } catch (error) {
      this.logger.error(`[ERROR] Failed to delete publication - publicationId: ${Body.idPublication}, userId: ${Body.utilisateurId}, error: ${error.message}`);
      throw error;
    }
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a publication' })
  @ApiResponse({
    status: 200,
    description: 'publication updated',
    examples: {
      example1: {
        summary: 'publication updated example',
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
  async updatePublication(
    @Body()
    Body: {
      idPublication: number;
      utilisateurId: number;
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
      rampe: boolean;
      ascenseur: boolean;
    },
    @Req() req: Request,
  ) {
    try {
      this.logger.log(`[INFO] Updating publication - publicationId: ${Body.idPublication}, userId: ${Body.utilisateurId}`);
      
      const utilisateur = await this.usersService.findOne(Body.utilisateurId);
      if (!utilisateur) {
        this.logger.warn(`[WARN] User not found for publication update - userId: ${Body.utilisateurId}`);
        throw new NotFoundException('Utilisateur non trouvé');
      }
      
      const publication = await this.publicationsService.findOne(Body.idPublication);
      if (!publication) {
        this.logger.warn(`[WARN] Publication not found for update - publicationId: ${Body.idPublication}`);
        throw new NotFoundException('publication not found');
      }
      
      if (publication.utilisateurId !== utilisateur.idUtilisateur) {
        this.logger.warn(`[WARN] User not authorized to update publication - userId: ${Body.utilisateurId}, publicationId: ${Body.idPublication}`);
        throw new NotFoundException('Utilisateur non autorisé à mettre à jour ce publication');
      }
      
      const updatedPublication = {
        ...publication,
        ...Body,
      };
      
      const result = await this.publicationsService.update(publication.idPublication, updatedPublication);
      this.logger.log(`[INFO] Publication updated successfully - publicationId: ${Body.idPublication}, userId: ${Body.utilisateurId}`);
      return result;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to update publication - publicationId: ${Body.idPublication}, userId: ${Body.utilisateurId}, error: ${error.message}`);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Return all publications' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PublicationDto,
  })
  async getPublications(@Req() req: Request): Promise<PublicationDto[]> {
    try {
      this.logger.log('[INFO] Fetching all publications');

      const publications = await this.publicationsService.findAll();
      this.logger.log(`[INFO] Publications retrieved successfully - count: ${publications.length}`);

      return Promise.all(
        publications.map(async (pub) => {
          const dto = new PublicationDto();

          dto.idPublication = pub.idPublication;
          dto.codePostal = pub.codePostal;
          dto.rue = pub.rue;
          dto.ville = pub.ville;
          dto.titre = pub.titre;
          dto.dateEvenement = pub.dateEvenement;
          dto.description = pub.description;
          dto.prix = pub.prix;
          dto.lien = pub.lien;
          dto.dateCreation = pub.dateCreation;
          dto.participantMax = pub.participantMax;
          dto.participantMin = pub.participantMin;
          dto.typePost = pub.typePost;
          dto.placeHandicape = pub.placeHandicape;
          dto.rampe = pub.rampe;
          dto.ascenseur = pub.ascenseur;
          dto.idUtilisateur = pub.utilisateurId;
          dto.idEcole = pub.idEcole;
          dto.nomEcole = pub.ecole?.nom ?? null;
          dto.listeEcoleIds = pub.listeEcoleIds;
          if (pub.image && pub.imageMimeType) {
            const base64 = pub.image.toString('base64');
            dto.image = `data:${pub.imageMimeType};base64,${base64}`;
          } else {
            dto.image = null;
          }

          dto.imageMimeType = pub.imageMimeType ?? null;

          dto.categories =
            pub.publicationCategories?.map((pc) => ({
              id: pc.categorie?.idCategorie ?? null,
              nom: pc.categorie?.nom ?? null,
            })) ?? [];

          // Attente de la récupération du groupe pour obtenir le nombre de participants
          const groupe = await this.groupsService.getGroupeByPublicationId(
            pub.idPublication,
          );
          dto.nombreParticipants = groupe?.participations?.length ?? 0;
          return dto;
        }),
      );
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch publications - error: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return one publication by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PublicationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'publication not found',
    examples: {
      example1: {
        summary: 'Not found response example',
        value: {
          statusCode: 404,
          message: 'publication not found',
          error: 'Not Found',
        },
      },
    },
  })
  async getPublicationById(@Param('id') id: number, @Req() req?: Request) {
    try {
      this.logger.log(`[INFO] Fetching publication by ID - publicationId: ${id}`);
      
      const pub = await this.publicationsService.findOne(id);

      if (!pub) {
        this.logger.warn(`[WARN] Publication not found - publicationId: ${id}`);
        throw new NotFoundException('publication not found');
      }

      this.logger.log(`[INFO] Publication found successfully - publicationId: ${id}, title: ${pub.titre}`);

      const dto = new PublicationDto();
      dto.idPublication = pub.idPublication;
      dto.codePostal = pub.codePostal;
      dto.rue = pub.rue;
      dto.ville = pub.ville;
      dto.titre = pub.titre;
      dto.dateEvenement = pub.dateEvenement;
      dto.description = pub.description;
      dto.prix = pub.prix;
      dto.lien = pub.lien;
      dto.dateCreation = pub.dateCreation;
      dto.participantMax = pub.participantMax;
      dto.participantMin = pub.participantMin;
      dto.typePost = pub.typePost;
      dto.placeHandicape = pub.placeHandicape;
      dto.rampe = pub.rampe;
      dto.ascenseur = pub.ascenseur;
      dto.idUtilisateur = pub.utilisateurId;
      dto.idEcole = pub.idEcole;
      dto.listeEcoleIds = pub.listeEcoleIds;
      dto.nomEcole = pub.ecole ? pub.ecole.nom : null;
      if (pub.image && pub.imageMimeType) {
        const base64 = pub.image.toString('base64');
        dto.image = `data:${pub.imageMimeType};base64,${base64}`;
      } else {
        dto.image = null;
      }
      dto.imageMimeType = pub.imageMimeType ?? null;
      dto.categories =
        pub.publicationCategories?.map((pc) => ({
          id: pc.categorie?.idCategorie ?? null,
          nom: pc.categorie?.nom ?? null,
        })) ?? [];

      return dto;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch publication by ID - publicationId: ${id}, error: ${error.message}`);
      throw error;
    }
  }

  @Get('participants/:idPublication')
  @ApiOperation({
    summary: 'Get participants of a publication by publication ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of participants for the publication',
    type: [PublicationDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Publication not found',
    examples: {
      example1: {
        summary: 'Not found response example',
        value: {
          statusCode: 404,
          message: 'Publication not found',
          error: 'Not Found',
        },
      },
    },
  })
  async getParticipantsByPublicationId(
    @Param('idPublication') idPublication: number,
    @Req() req: Request,
  ): Promise<UserDto[]> {
    try {
      this.logger.log(`[INFO] Fetching participants for publication - publicationId: ${idPublication}`);

      const publication = await this.publicationsService.findOne(idPublication);
      if (!publication) {
        this.logger.warn(`[WARN] Publication not found for participants lookup - publicationId: ${idPublication}`);
        throw new NotFoundException('Publication not found');
      }

      const groupe = await this.groupsService.getGroupeByPublicationId(idPublication);
      if (!groupe) {
        this.logger.warn(`[WARN] No group found for publication - publicationId: ${idPublication}`);
        return [];
      }

      // Return les utilisateurs du groupe
      const participants = await this.groupsService.findUsersByGroup(groupe.idGroupe);

      if (!participants || participants.length === 0) {
        this.logger.warn(`[WARN] No participants found for publication - publicationId: ${idPublication}`);
        return [];
      }

      this.logger.log(`[INFO] Participants found successfully - publicationId: ${idPublication}, count: ${participants.length}`);

      // Retourne les participants sous forme de user DTO
      return participants.map((user) => {
        const userDto = new UserDto();
        userDto.nom = user.nom;
        userDto.prenom = user.prenom;
        userDto.mail = user.mail;
        userDto.pseudo = user.pseudo;
        return userDto;
      });
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch participants for publication - publicationId: ${idPublication}, error: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a publication' })
  @ApiResponse({
    status: 201,
    description: 'publication created',
    examples: {
      example1: {
        summary: 'publication created example',
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
          image: 'https://domain.com/chemin/vers/image.jpg',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createPublication(
    @Body()
    body: {
      titre: string;
      dateEvenement: Date;
      participantMax: number;
      participantMin: number;
      prix: number;
      codePostal: string;
      description: string;
      rue: string;
      ville: string;
      lien: string;
      typePost: 'Evenement' | 'activité';
      placeHandicape: string | boolean;
      rampe: string | boolean;
      ascenseur: string | boolean;
      utilisateurId: number;
      categories: number[] | string;
      idEcole?: number;
      ListeEcoleIds?: string;
    },
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      this.logger.log(`[INFO] Creating new publication - userId: ${body.utilisateurId}, title: ${body.titre}`);

      const utilisateur = await this.usersService.findEntityById(body.utilisateurId);
      const ecole = await this.schoolsService.findByUserId(body.utilisateurId);
      
      if (!utilisateur) {
        this.logger.warn(`[WARN] User not found for publication creation - userId: ${body.utilisateurId}`);
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (typeof body.categories === 'string') {
        body.categories = JSON.parse(body.categories);
      }

      const publicationData = {
        ...body,
        idEcole: utilisateur.idEcole,
        nomEcole: ecole.nom,
        utilisateur,
        placeHandicape: body.placeHandicape === 'true' || body.placeHandicape === true,
        rampe: body.rampe === 'true' || body.rampe === true,
        ascenseur: body.ascenseur === 'true' || body.ascenseur === true,
        image: image?.buffer ?? null,
        imageMimeType: image?.mimetype ?? null,
      };

      // 1. Création de la publication
      const publication = await this.publicationsService.create(publicationData);
      this.logger.log(`[INFO] Publication created successfully - publicationId: ${publication.idPublication}, userId: ${body.utilisateurId}`);

      // 2. Création du groupe lié à la publication (avec organisateur)
      const groupe = await this.groupsService.create({
        nomDuGroupe: publication.titre,
        publication: publication,
        utilisateur: utilisateur,
      });
      this.logger.log(`[INFO] Group created for publication - groupId: ${groupe.idGroupe}, publicationId: ${publication.idPublication}`);

      // 3. Création de la discussion liée au groupe
      const discussion = await this.discussionService.create({
        typeDiscussion: 1, // Type par défaut pour les discussions de publication
        idGroupe: groupe.idGroupe,
      });
      this.logger.log(`[INFO] Discussion created for group - discussionId: ${discussion.idDiscussion}, groupId: ${groupe.idGroupe}`);

      // 4. Ajout du créateur comme participant (plus besoin de organisateur)
      /*await this.groupsService.addParticipation({
        idGroupe: groupe,
        idUtilisateur: utilisateur,
        idPaiement: null,
      });*/

      // 5. Ajout des catégories à la publication
      for (const idCategorie of body.categories as number[]) {
        await this.publicationCategoriesService.addCategoryToPublication(
          publication.idPublication,
          idCategorie,
        );
      }
      this.logger.log(`[INFO] Categories added to publication - publicationId: ${publication.idPublication}, categoriesCount: ${(body.categories as number[]).length}`);

      return {
        message: 'Publication, groupe et discussion créés avec succès',
        publication,
        groupe,
        discussion,
      };
    } catch (error) {
      this.logger.error(`[ERROR] Failed to create publication - userId: ${body.utilisateurId}, title: ${body.titre}, error: ${error.message}`);
      throw error;
    }
  }

  @Post('userPublications')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all publications created by a specific user' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    examples: {
      example1: {
        summary: 'Publications by user example',
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
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserPublications(
    @Body() body: { utilisateurId: number },
    @Req() req: Request,
  ) {
    try {
      this.logger.log(`[INFO] Fetching publications for user - userId: ${body.utilisateurId}`);
      
      const utilisateur = await this.usersService.findOne(body.utilisateurId);
      if (!utilisateur) {
        this.logger.warn(`[WARN] User not found for publications lookup - userId: ${body.utilisateurId}`);
        throw new NotFoundException('Utilisateur non trouvé');
      }

      const publications = await this.publicationsService.findByUser(body.utilisateurId);
      this.logger.log(`[INFO] User publications retrieved successfully - userId: ${body.utilisateurId}, count: ${publications.length}`);
      return publications;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch user publications - userId: ${body.utilisateurId}, error: ${error.message}`);
      throw error;
    }
  }

  @Get('user/:utilisateurId')
  @ApiOperation({ summary: 'Return all publications for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PublicationDto,
  })
  async getPublicationsByUser(
    @Param('utilisateurId') utilisateurId: number,
  ): Promise<PublicationDto[]> {
    try {
      this.logger.log(`[INFO] Fetching publications by user - userId: ${utilisateurId}`);
      
      const publications = await this.publicationsService.getPublicationsByUser(utilisateurId);
      this.logger.log(`[INFO] Publications by user retrieved successfully - userId: ${utilisateurId}, count: ${publications.length}`);
      
      return Promise.all(
        publications.map(async (pub) => {
          const dto = new PublicationDto();

          dto.idPublication = pub.idPublication;
          dto.codePostal = pub.codePostal;
          dto.rue = pub.rue;
          dto.ville = pub.ville;
          dto.titre = pub.titre;
          dto.dateEvenement = pub.dateEvenement;
          dto.description = pub.description;
          dto.prix = pub.prix;
          dto.lien = pub.lien;
          dto.dateCreation = pub.dateCreation;
          dto.participantMax = pub.participantMax;
          dto.participantMin = pub.participantMin;
          dto.typePost = pub.typePost;
          dto.placeHandicape = pub.placeHandicape;
          dto.rampe = pub.rampe;
          dto.ascenseur = pub.ascenseur;
          dto.idUtilisateur = pub.utilisateurId;

          if (pub.image && pub.imageMimeType) {
            const base64 = pub.image.toString('base64'); // Utilisation du Buffer sans data
            dto.image = `data:${pub.imageMimeType};base64,${base64}`;
          } else {
            dto.image = null;
          }
          dto.imageMimeType = pub.imageMimeType ?? null;
          dto.categories =
            pub.publicationCategories?.map((pc) => ({
              id: pc.categorie?.idCategorie ?? null,
              nom: pc.categorie?.nom ?? null,
            })) ?? [];
          // Attente de la récupération du groupe pour obtenir le nombre de participants
          const groupe = await this.groupsService.getGroupeByPublicationId(
            pub.idPublication,
          );
          dto.nombreParticipants = groupe?.participations?.length ?? 0;

          dto.idGroupe = groupe?.idGroupe ?? null;

          const participation = groupe?.participations?.find(
            (p) =>
              p.idUtilisateur && p.idUtilisateur.idUtilisateur == utilisateurId,
          );
          dto.idParticipation = participation?.idParticipation ?? null;
          dto.paiementEffectue = participation?.paiementEffectue ?? false;

          return dto;
        }),
      );
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch publications by user - userId: ${utilisateurId}, error: ${error.message}`);
      throw error;
    }
  }

  @Post('userParticipations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all publications the user participates in' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    examples: {
      example1: {
        summary: 'Publications the user participates in',
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
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserParticipations(
    @Body() body: { utilisateurId: number },
    @Req() req: Request,
  ) {
    try {
      this.logger.log(`[INFO] Fetching participations for user - userId: ${body.utilisateurId}`);
      
      // Vérifier si l'utilisateur existe
      const utilisateur = await this.usersService.findOne(body.utilisateurId);
      if (!utilisateur) {
        this.logger.warn(`[WARN] User not found for participations lookup - userId: ${body.utilisateurId}`);
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Récupérer les participations de l'utilisateur
      const participations = await this.publicationsService.findParticipationsByUser(body.utilisateurId);
      this.logger.log(`[INFO] User participations retrieved successfully - userId: ${body.utilisateurId}, count: ${participations.length}`);
      
      // Extraire les publications des participations
      //const publications = participations.map((participation) => participation.idGroupe.publication);

      return participations;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch user participations - userId: ${body.utilisateurId}, error: ${error.message}`);
      throw error;
    }
  }

  @Post('/accessible-ecoles')
  @ApiOperation({
    summary:
      'Get accessible school IDs for a user based on listeEcoleIds of publications',
  })
  async getAccessibleSchoolsPost(
    @Body('userId') userId: number,
    @Req() req: Request,
  ): Promise<{ id: number; nom: string }[]> {
    try {
      this.logger.log(`[INFO] Getting accessible schools for user - userId: ${userId}`);
      
      const user = await this.usersService.findEntityById(userId);
      const idEcoleUser = user?.idEcole;
      
      if (!idEcoleUser) {
        this.logger.warn(`[WARN] User has no school assigned - userId: ${userId}`);
        return [];
      }
      
      const publications = await this.publicationsService.findAllWhereEcoleIdInListe(idEcoleUser);
      const uniqueEcoles = new Map<number, string>();
      
      for (const pub of publications) {
        if (pub.ecole) {
          uniqueEcoles.set(pub.idEcole, pub.ecole.nom);
        }
      }
      
      const result = Array.from(uniqueEcoles.entries()).map(([id, nom]) => ({ id, nom }));
      this.logger.log(`[INFO] Accessible schools retrieved successfully - userId: ${userId}, schoolsCount: ${result.length}`);
      return result;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to get accessible schools - userId: ${userId}, error: ${error.message}`);
      throw error;
    }
  }

  @Get('count')
  @ApiOperation({ summary: 'Get the total count of publications' })
  @ApiResponse({
    status: 200,
    description: 'Total count of publications',
    examples: {
      example1: {
        summary: 'Count example',
        value: {
          count: 42,
        },
      },
    },
  })
  async getPublicationCount(@Req() req: Request): Promise<{ count: number }> {
    try {
      this.logger.log('[INFO] Fetching publication count');

      const count = await this.publicationsService.count();
      this.logger.log(`[INFO] Publication count retrieved successfully - count: ${count}`);

      return { count };
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch publication count - error: ${error.message}`);
      throw error;
    }
  }
}
