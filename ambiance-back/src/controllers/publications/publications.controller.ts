import { Controller, Get, Post, Param, NotFoundException, UseGuards, Body,Req,Logger,UploadedFile, UseInterceptors, Param  } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicationsService } from '../../services/publications/publications.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicationDto } from 'src/dtos/publications.dto';

@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService, private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) { }

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
    return await this.publicationsService.remove(publication.idPublication);
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
  },@Req() req: Request) {
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

  return publications.map(pub => {
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
    dto.utilisateurId = pub.utilisateurId;

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

    return dto;
  });
}




  @Get(':id')
  @ApiOperation({ summary: 'Return one publication by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    examples: {
      example1: {
        summary: 'Successful response example',
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
    const publication = await this.publicationsService.findOne(id);
    if (!publication) {
      throw new NotFoundException('publication not found');
    }
    return publication;
  }

  @Post("create")
  @UseGuards(AuthGuard('jwt'))
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
    @Body() Body: {
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
      utilisateurId: number;
    }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Creating a new publication`, Body);

    },@Req() req: Request,
    @UploadedFile() image: Express.Multer.File
  ) {
     this.logger.log(`[${req.method} ${req.url}] Creating a new publication`, Body);

    const utilisateur = await this.usersService.findOne(Body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Création de l'objet publication avec image
    const publicationData = { 
      ...Body, 
      utilisateur, 
      image: image.buffer,  // image binaire
      imageMimeType: image.mimetype  // type mime de l'image
    };

    return await this.publicationsService.create(publicationData);
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
