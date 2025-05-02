import { Controller, Get, Post, Param, NotFoundException, UseGuards, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicationsService } from '../../services/publications/publications.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service';

@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService, private readonly usersService: UsersService) { }

  @Get('test')//endpoint (endpoit ALWAYS before controller endpoint)
  @UseGuards(AuthGuard('jwt')) //protected request
  getProtectedData() {
    return { message: 'Accès autorisé à la route protégée.' };
  }

  @Post("delete")
  @UseGuards(AuthGuard('jwt'))
  async deletePublication(@Body() Body: { idPublication: number, utilisateurId: number }) {
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
  }) {
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
    examples: {
      example1: {
        summary: 'Successful response example',
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
  async getPublications() {
    return await this.publicationsService.findAll();
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
  async getPublicationById(@Param('id') id: number) {
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
        },
      },
    },
  })
  async createPublication(@Body() Body:
    {
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
      rampe: boolean,
      ascenseur: boolean,
      utilisateurId: number;
    }) {
    const utilisateur = await this.usersService.findOne(Body.utilisateurId);
    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const publication = { ...Body, utilisateur };
    return await this.publicationsService.create(publication);
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
  async getUserPublications(@Body() body: { utilisateurId: number }) {
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
  async getUserParticipations(@Body() body: { utilisateurId: number }) {
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
