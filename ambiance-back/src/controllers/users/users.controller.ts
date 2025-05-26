import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Logger,
  UseInterceptors,
  UploadedFile,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/users.entity';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto, UserDto } from 'src/dtos/user.dto';
import { Request as ExpressRequest } from 'express';
import * as crypto from 'crypto';
import { MailService } from 'src/services/mail.service';
import { AuthService } from 'src/services/auth/auth.service';

import * as bcrypt from 'bcrypt';

interface RequestWithCookies extends ExpressRequest {
  cookies: { [key: string]: string };
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Post('findAll')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Return all Users if the requester is an admin' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    examples: {
      example1: {
        summary: 'Successful response example',
        value: [
          {
            idUtilisateur: 1,
            prenom: 'test',
            nom: 'test',
            pseudo: 'test',
            dateDeNaissance: '2024-11-06T10:36:19.000Z',
            description: 'Scary movie',
            genre: 'Homme',
            mail: 'test@test.com',
            motDePasse: 'azerty',
            role: 'Utilisateur',
            telephone: '0123456789',
          },
        ],
      },
    },
  })
  async findAll(
    @Body() body: { userId: number },
    @Req() req: Request,
  ): Promise<UserDto[]> {
    this.logger.log(
      `[${req.method} ${req.url}] Fetching all users`,
      body.userId,
    ); // Log de la requête
    const user = await this.usersService.findOne(body.userId);

    if (!user || user.role !== 'Administrateur') {
      throw new HttpException(
        'Access denied: Only administrators can access this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req: Request): Promise<UserDto> {
    this.logger.log(`[${req.method} ${req.url}] Fetching user with ID: ${id}`); // Log de la requête
    return this.usersService.findOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new User' })
  async create(
    @Body()
    body: {
      prenom: string;
      nom: string;
      dateDeNaissance: Date;
      genre: 'Homme' | 'Femme' | 'Autre';
      mail: string;
      motDePasse: string;
      telephone: string;
      pays: string;
    },
    @Req() req: Request,
  ) {
    this.logger.log(`[${req.method} ${req.url}] Creating a new user`, body);

    const futureUser = { ...body, role: 'Utilisateur' } as User;

    try {
      // Hash du mot de passe
      const saltRoundsEnv = process.env.SALT_ROUNDS;
      if (!saltRoundsEnv || isNaN(Number(saltRoundsEnv))) {
        throw new Error('SALT_ROUNDS is not defined or is not a valid number');
      }
      const salt = await bcrypt.genSalt(parseInt(saltRoundsEnv));
      const hash = await bcrypt.hash(futureUser.motDePasse, salt);

      futureUser.motDePasse = hash;

      // Génération token confirmation + expiration 24h
      const token = crypto.randomBytes(32).toString('hex');
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      futureUser.confirmationToken = token;
      futureUser.confirmationTokenExpires = expirationDate;
      futureUser.emailConfirmed = false;

      // Log des données à insérer
      console.log('futureUser to insert:', JSON.stringify(futureUser, null, 2));

      // Création en base
      const createdUser = await this.usersService.create(futureUser);

      // Envoi mail de confirmation (optionnel : tu peux aussi le faire dans un service à part)
      try {
        await this.mailService.sendConfirmationEmail(createdUser.mail, token);
      } catch (mailError) {
        // Log complet de l'erreur d'envoi de mail
        console.error('Error sending confirmation email:', {
          message: mailError?.message,
          stack: mailError?.stack,
          code: mailError?.code,
          error: mailError,
        });
        // Optionnel : supprimer l'utilisateur créé si l'email échoue
        await this.usersService.remove(createdUser.idUtilisateur);
        throw new HttpException(
          'USER_CREATED_BUT_EMAIL_FAILED',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Ne pas renvoyer mot de passe, token etc.
      delete createdUser.motDePasse;
      delete createdUser.confirmationToken;
      delete createdUser.confirmationTokenExpires;

      return createdUser;
    } catch (error) {
      // Log complet de l'erreur pour debug
      console.error('Error during user creation:', {
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        error,
      });
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('Mail')) {
        throw new HttpException('EMAIL_ALREADY_USED', HttpStatus.BAD_REQUEST);
      }
      if (error.response === 'USER_CREATED_BUT_EMAIL_FAILED') {
        throw new HttpException(
          'Utilisateur créé mais l\'envoi de l\'email a échoué. Contactez un administrateur.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.error('Error during user creation', {
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        error,
      });
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<UpdateUserDto>,
    @Req() req: RequestWithCookies,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<UserDto> {
    this.logger.log(`[${req.method} ${req.url}] Updating user with ID: ${id}`);

    const connectedUserId = id || req.cookies['user_id']; // selon ta config

    if (!connectedUserId) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // Vérification que l'utilisateur connecté ne modifie QUE SON propre profil
    if (connectedUserId !== id) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre compte',
      );
    }

    if (image) {
      // Convertis directement le buffer en base64 string, en précisant le mimetype envoyé dans updateUserDto
      updateUserDto.image = image.buffer.toString('base64');
      updateUserDto.imageMimeType =
        updateUserDto.imageMimeType || image.mimetype; // fallback
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    this.logger.log(`[${req.method} ${req.url}] Removing user with ID: ${id}`);
    return this.usersService.remove(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate user account with confirmation token' })
  async validateUser(@Body() body: { token: string }) {
    const { token } = body;

    if (!token) {
      throw new HttpException('Token manquant', HttpStatus.BAD_REQUEST);
    }

    // Recherche utilisateur avec ce token
    const user = await this.usersService.findByConfirmationToken(token);

    if (!user) {
      throw new HttpException('Token invalide ou expiré', HttpStatus.NOT_FOUND);
    }

    if (user.emailConfirmed) {
      throw new HttpException(
        'Utilisateur déjà validé',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Vérification expiration du token
    if (user.confirmationTokenExpires < new Date()) {
      throw new HttpException('Token expiré', HttpStatus.BAD_REQUEST);
    }

    // Valider utilisateur
    const updateUserDto: Partial<UpdateUserDto> = {
      emailConfirmed: true,
      confirmationToken: null,
      confirmationTokenExpires: null,
    };

    await this.usersService.update(user.idUtilisateur, updateUserDto);

    return { message: 'Utilisateur validé avec succès' };
  }

  @Post('resend-confirmation-email')
  async resendConfirmationEmail(@Body('id') id: number) {
    const user = await this.usersService.findEntityById(id);

    if (!user || user.emailConfirmed) {
      throw new BadRequestException('Utilisateur invalide ou déjà confirmé.');
    }

    // Génération du nouveau token et date d'expiration
    const token = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Mise à jour du user en base
    await this.usersService.updateConfirmationToken(
      user.idUtilisateur,
      token,
      expirationDate,
    );

    // Envoi de l'email
    await this.mailService.sendConfirmationEmail(user.mail, token);

    return { message: 'Mail de confirmation renvoyé' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('mail') mail: string) {
    const user = await this.usersService.findOneByMail(mail);
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    const token = this.authService.generateResetPasswordToken(
      user.idUtilisateur,
    );
    await this.mailService.sendResetPasswordEmail(user.mail, token);

    return { message: 'Email de réinitialisation envoyé' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;

    let payload;
    try {
      payload = this.authService.verifyResetPasswordToken(token);
    } catch {
      throw new BadRequestException('Token invalide ou expiré');
    }

    const userId = payload.sub;
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(newPassword, salt);

    await this.usersService.update(userId, { motDePasse: newPassword });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
