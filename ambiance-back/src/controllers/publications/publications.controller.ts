import { Controller, Get, Post, Param, NotFoundException, UseGuards, Body, Req, Logger, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicationsService } from '../../services/publications/publications.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicationDto } from 'src/dtos/publications.dto';
import { PublicationCategoriesService } from 'src/services/publication-categories/publication-categories.service';
import { GroupsService } from 'src/services/groups/groups.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';

@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService, private readonly usersService: UsersService, private publicationCategoriesService: PublicationCategoriesService, private groupsService: GroupsService, private readonly logger: Logger) { }

  @Get('test')//endpoint (endpoit ALWAYS before controller endpoint)
  @UseGuards(AuthGuard('jwt')) //protected request
  getProtectedData() {
    return { message: 'Accès autorisé à la route protégée.' };
  }

  @Post("delete")
  @UseGuards(AuthGuard('jwt'))
  async deletePublication(@Body() Body: { idPublication: number, utilisateurId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Deleting publication`, Body);

    const utilisateur = await this.usersService.findOne(Body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const publication = await this.publicationsService.findOne(Body.idPublication);
    if (!publication) {
      throw new NotFoundException('publication not found');
    }
    if (publication.utilisateurId !== utilisateur.idUtilisateur) {
      throw new NotFoundException('Utilisateur non autorisé à supprimer ce publication');
    }

    // 1. Récupérer le groupe lié à la publication
    const groupe = await this.groupsService.getGroupeByPublicationId(publication.idPublication);

    if (groupe) {
      // 2. Supprimer toutes les participations liées à ce groupe
      if (groupe.participations && groupe.participations.length > 0) {
        for (const participation of groupe.participations) {
          await this.groupsService.removeUserFromGroup(groupe.idGroupe, participation.idUtilisateur.idUtilisateur);
        }
      }
      // 3. Supprimer le groupe
      await this.groupsService.remove(groupe.idGroupe);
    }

    // 4. Supprimer la publication
    await this.publicationsService.remove(publication.idPublication);

    return { message: 'Publication, groupe et participations supprimés avec succès' };
  }

  @Post("update")
  @UseGuards(AuthGuard('jwt'))
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
  async updatePublication(@Body() Body: {
    idPublication: number,
    utilisateurId: number,
    codePostal: string,
    rue: string,
    ville: string,
    titre: string,
    dateEvenement: Date,
    description: string,
    prix: number,
    lien: string,
    participantMax: number,
    participantMin: number,
    typePost: 'Evenement' | 'activité',
    placeHandicape: boolean,
    rampe: boolean,
    ascenseur: boolean,
  }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Updating publication`, Body.idPublication);
    const utilisateur = await this.usersService.findOne(Body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const publication = await this.publicationsService.findOne(Body.idPublication);
    if (!publication) {
      throw new NotFoundException('publication not found');
    }
    if (publication.utilisateurId !== utilisateur.idUtilisateur) {
      throw new NotFoundException('Utilisateur non autorisé à mettre à jour ce publication');
    }
    const updatedPublication = {
      ...publication,
      ...Body,
    };
    return await this.publicationsService.update(publication.idPublication, updatedPublication);
  }

  @Get()
  @ApiOperation({ summary: 'Return all publications' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PublicationDto,
  })
  async getPublications(@Req() req: Request): Promise<PublicationDto[]> {
    this.logger.log(`[${req.method} ${req.url}] Fetching all publications`);

    const publications = await this.publicationsService.findAll();

    return Promise.all(publications.map(async pub => {
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

      // Si pub.image est déjà un Buffer, tu peux directement le convertir
      if (pub.image && pub.imageMimeType) {
        const base64 = pub.image.toString('base64');  // Utilisation du Buffer sans data
        dto.image = `data:${pub.imageMimeType};base64,${base64}`;
      } else {
        dto.image = null;
      }

      dto.imageMimeType = pub.imageMimeType ?? null;

      dto.categories = pub.publicationCategories?.map(pc => ({
        id: pc.categorie?.idCategorie ?? null,
        nom: pc.categorie?.nom ?? null,
      })) ?? [];

      // Attente de la récupération du groupe pour obtenir le nombre de participants
      const groupe = await this.groupsService.getGroupeByPublicationId(pub.idPublication);
      dto.nombreParticipants = groupe?.participations?.length ?? 0;
      return dto;
    }));
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
  async getPublicationById(@Param('id') id: number, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching publication with ID: ${id}`);

    const pub = await this.publicationsService.findOne(id);

    if (!pub) {
      throw new NotFoundException('publication not found');
    }

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
      const base64 = pub.image.toString('base64');
      dto.image = `data:${pub.imageMimeType};base64,${base64}`;
    } else {
      dto.image = null;
    }
    dto.imageMimeType = pub.imageMimeType ?? null;
    dto.categories = pub.publicationCategories?.map(pc => ({
      id: pc.categorie?.idCategorie ?? null,
      nom: pc.categorie?.nom ?? null,
    })) ?? [];

    return dto;
  }

  @UseGuards(JwtAuthGuard)
  @Post("create")
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
          image: 'https://domain.com/chemin/vers/image.jpg'
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createPublication(
    @Body() body: {
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
      categories: number[] | string; // Peut être un string JSON envoyé depuis le formulaire
    },
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request
  ) {
    this.logger.log(`[${req.method} ${req.url}] Creating a new publication with body: ${JSON.stringify(body)}`);

    const utilisateur = await this.usersService.findOne(body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (typeof body.categories === 'string') {
      try {
        body.categories = JSON.parse(body.categories);
      } catch (err) {
        throw new BadRequestException('Le champ "categories" doit être un tableau ou un JSON valide');
      }
    }

    const publicationData = {
      ...body,
      utilisateur,
      placeHandicape: body.placeHandicape === 'true' || body.placeHandicape === true,
      rampe: body.rampe === 'true' || body.rampe === true,
      ascenseur: body.ascenseur === 'true' || body.ascenseur === true,
      image: image?.buffer ?? null,
      imageMimeType: image?.mimetype ?? null,
    };

    // 1. Création de la publication
    const publication = await this.publicationsService.create(publicationData);

    // 2. Création du groupe lié à la publication
    const groupe = await this.groupsService.create({
      nomDuGroupe: publication.titre,
      publication: publication, // Passer l'objet Publication complet
      nombrePersonne: null, // ou null, à adapter selon ta logique
    });

    // 3. Ajout du créateur comme organisateur dans Participation
    await this.groupsService.addParticipation({
      idGroupe: groupe,
      idUtilisateur: utilisateur,
      organisateur: true,
      idPaiement: null,
    });

    // 4. Ajout des catégories à la publication
    for (const idCategorie of body.categories as number[]) {
      await this.publicationCategoriesService.addCategoryToPublication(publication.idPublication, idCategorie);
    }

    return { message: 'Publication et groupe créés avec succès', publication, groupe };
  }

  @Post('userPublications')
  @UseGuards(AuthGuard('jwt'))
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
  async getUserPublications(@Body() body: { utilisateurId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching publications for user`, body.utilisateurId);
    const utilisateur = await this.usersService.findOne(body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return await this.publicationsService.findByUser(body.utilisateurId);
  }

  @Get('user/:utilisateurId')
  @ApiOperation({ summary: 'Return all publications for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PublicationDto,
  })
  async getPublicationsByUser(@Param('utilisateurId') utilisateurId: number): Promise<PublicationDto[]> {
    const publications = await this.publicationsService.getPublicationsByUser(utilisateurId);
    return Promise.all(
      publications.map(async pub => {
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
          const base64 = pub.image.toString('base64');  // Utilisation du Buffer sans data
          dto.image = `data:${pub.imageMimeType};base64,${base64}`;
        } else {
          dto.image = null;
        }
        dto.imageMimeType = pub.imageMimeType ?? null;
        dto.categories = pub.publicationCategories?.map(pc => ({
          id: pc.categorie?.idCategorie ?? null,
          nom: pc.categorie?.nom ?? null,
        })) ?? [];
        // Attente de la récupération du groupe pour obtenir le nombre de participants
        const groupe = await this.groupsService.getGroupeByPublicationId(pub.idPublication);
        dto.nombreParticipants = groupe?.participations?.length ?? 0;

        dto.idGroupe = groupe?.idGroupe ?? null;

        const participation = groupe?.participations?.find(
          p => p.idUtilisateur && p.idUtilisateur.idUtilisateur == utilisateurId
        );
        dto.idParticipation = participation?.idParticipation ?? null;
        dto.paiementEffectue = participation?.paiementEffectue ?? false;

        return dto;
      }),
    );
  }

  @Post('userParticipations')
  @UseGuards(AuthGuard('jwt'))
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
  async getUserParticipations(@Body() body: { utilisateurId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching participations for user`, body.utilisateurId);
    // Vérifier si l'utilisateur existe
    const utilisateur = await this.usersService.findOne(body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Récupérer les participations de l'utilisateur
    const participations = await this.publicationsService.findParticipationsByUser(body.utilisateurId);
    // Extraire les publications des participations
    //const publications = participations.map((participation) => participation.idGroupe.publication);

    return participations;
  }
}