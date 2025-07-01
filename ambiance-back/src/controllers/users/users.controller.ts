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
import { SchoolsService } from 'src/services/schools/schools.service';

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
    private readonly schoolsService: SchoolsService,
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
      `[INFO] [${req.method} ${req.url}] Fetching all users`,
      { userId: body.userId }
    );
    
    const user = await this.usersService.findOne(body.userId);

    if (!user || user.role !== 'Administrateur') {
      this.logger.warn(
        `[WARN] [${req.method} ${req.url}] Access denied - User not admin`,
        { userId: body.userId, userRole: user?.role || 'not_found' }
      );
      throw new HttpException(
        'Access denied: Only administrators can access this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Users fetched successfully`,
      { requestedBy: body.userId }
    );
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req: Request): Promise<UserDto> {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Fetching user by ID`,
      { userId: id }
    );
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
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Starting user creation`,
      { email: body.mail, prenom: body.prenom, nom: body.nom }
    );

    const futureUser = { ...body, role: 'Utilisateur' } as User;

    try {
      // Vérification du domaine d'email pour école partenaire
      const emailDomain = this.schoolsService.extractDomainFromEmail(futureUser.mail);
      const partnerSchool = await this.schoolsService.findByAllowedDomain(emailDomain);
      
      if (partnerSchool) {
        futureUser.idEcole = partnerSchool.id;
        this.logger.log(
          `[INFO] [${req.method} ${req.url}] User associated with partner school`,
          { schoolName: partnerSchool.nom, schoolId: partnerSchool.id, emailDomain }
        );
      } else {
        this.logger.warn(
          `[WARN] [${req.method} ${req.url}] No partner school found for domain`,
          { emailDomain, userEmail: futureUser.mail }
        );
        throw new HttpException(
          `L'inscription est réservée aux étudiants des écoles partenaires. Le domaine ${emailDomain} n'est pas autorisé.`,
          HttpStatus.FORBIDDEN,
        );
      }

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

      // Création en base
      const createdUser = await this.usersService.create(futureUser);

      this.logger.log(
        `[INFO] [${req.method} ${req.url}] User created in database`,
        { userId: createdUser.idUtilisateur, email: createdUser.mail }
      );

      // Envoi mail de confirmation (optionnel : tu peux aussi le faire dans un service à part)
      try {
        await this.mailService.sendConfirmationEmail(createdUser.mail, token);
        this.logger.log(
          `[INFO] [${req.method} ${req.url}] Confirmation email sent successfully`,
          { userId: createdUser.idUtilisateur, email: createdUser.mail }
        );
      } catch (mailError) {
        this.logger.error(
          `[ERROR] [${req.method} ${req.url}] Failed to send confirmation email`,
          { 
            userId: createdUser.idUtilisateur,
            email: createdUser.mail,
            error: mailError.message 
          }
        );
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
      this.logger.error(
        `[ERROR] [${req.method} ${req.url}] User creation failed`,
        {
          email: body?.mail,
          error: error.message,
          errorCode: error.code
        }
      );
      
      // Gestion spécifique de l'erreur de domaine non autorisé
      if (error.status === HttpStatus.FORBIDDEN && error.message?.includes('domaine')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            error: 'DOMAIN_NOT_ALLOWED',
            message: error.message,
          },
          HttpStatus.FORBIDDEN,
        );
      }
      
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('Mail')) {
        this.logger.warn(
          `[WARN] [${req.method} ${req.url}] Email already exists`,
          { email: body?.mail }
        );
        throw new HttpException('EMAIL_ALREADY_USED', HttpStatus.BAD_REQUEST);
      }
      if (error.response === 'USER_CREATED_BUT_EMAIL_FAILED') {
        throw new HttpException(
          'Utilisateur créé mais l\'envoi de l\'email a échoué. Contactez un administrateur.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

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
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Starting user update`,
      { userId: id }
    );

    const connectedUserId = id || req.cookies['user_id']; // selon ta config

    if (!connectedUserId) {
      this.logger.warn(
        `[WARN] [${req.method} ${req.url}] User not authenticated`,
        { requestedUserId: id }
      );
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // Vérification que l'utilisateur connecté ne modifie QUE SON propre profil
    if (connectedUserId !== id) {
      this.logger.warn(
        `[WARN] [${req.method} ${req.url}] User trying to modify another profile`,
        { connectedUserId, requestedUserId: id }
      );
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre compte',
      );
    }

    if (image) {
      this.logger.log(
        `[INFO] [${req.method} ${req.url}] Image uploaded for user`,
        { userId: id, imageSize: image.size, imageMimeType: image.mimetype }
      );
      // Convertis directement le buffer en base64 string, en précisant le mimetype envoyé dans updateUserDto
      updateUserDto.image = image.buffer.toString('base64');
      updateUserDto.imageMimeType =
        updateUserDto.imageMimeType || image.mimetype; // fallback
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Removing user`,
      { userId: id }
    );
    return this.usersService.remove(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate user account with confirmation token' })
  async validateUser(@Body() body: { token: string }) {
    const { token } = body;

    if (!token) {
      this.logger.warn('[WARN] [POST /users/validate] Token missing in validation request');
      throw new HttpException('Token manquant', HttpStatus.BAD_REQUEST);
    }

    // Recherche utilisateur avec ce token
    const user = await this.usersService.findByConfirmationToken(token);

    if (!user) {
      this.logger.warn(
        '[WARN] [POST /users/validate] Invalid or expired token',
        { token: token.substring(0, 8) + '...' }
      );
      throw new HttpException('Token invalide ou expiré', HttpStatus.NOT_FOUND);
    }

    if (user.emailConfirmed) {
      this.logger.warn(
        '[WARN] [POST /users/validate] User already validated',
        { userId: user.idUtilisateur }
      );
      throw new HttpException(
        'Utilisateur déjà validé',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Vérification expiration du token
    if (user.confirmationTokenExpires < new Date()) {
      this.logger.warn(
        '[WARN] [POST /users/validate] Token expired',
        { userId: user.idUtilisateur, expiredAt: user.confirmationTokenExpires }
      );
      throw new HttpException('Token expiré', HttpStatus.BAD_REQUEST);
    }

    // Valider utilisateur
    const updateUserDto: Partial<UpdateUserDto> = {
      emailConfirmed: true,
      confirmationToken: null,
      confirmationTokenExpires: null,
    };

    await this.usersService.update(user.idUtilisateur, updateUserDto);

    this.logger.log(
      '[INFO] [POST /users/validate] User validated successfully',
      { userId: user.idUtilisateur, email: user.mail }
    );

    return { message: 'Utilisateur validé avec succès' };
  }

  @Post('resend-confirmation-email')
  async resendConfirmationEmail(@Body('id') id: number) {
    this.logger.log(
      '[INFO] [POST /users/resend-confirmation-email] Resending confirmation email',
      { userId: id }
    );

    const user = await this.usersService.findEntityById(id);

    if (!user || user.emailConfirmed) {
      this.logger.warn(
        '[WARN] [POST /users/resend-confirmation-email] Invalid user or already confirmed',
        { userId: id, userExists: !!user, emailConfirmed: user?.emailConfirmed }
      );
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

    this.logger.log(
      '[INFO] [POST /users/resend-confirmation-email] Confirmation email resent successfully',
      { userId: id, email: user.mail }
    );

    return { message: 'Mail de confirmation renvoyé' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('mail') mail: string) {
    this.logger.log(
      '[INFO] [POST /users/forgot-password] Password reset requested',
      { email: mail }
    );
    
    const user = await this.usersService.findOneByMail(mail);
    if (!user) {
      this.logger.warn(
        '[WARN] [POST /users/forgot-password] User not found for password reset',
        { email: mail }
      );
      throw new BadRequestException('Utilisateur non trouvé');
    }

    const token = this.authService.generateResetPasswordToken(
      user.idUtilisateur,
    );
    await this.mailService.sendResetPasswordEmail(user.mail, token);

    this.logger.log(
      '[INFO] [POST /users/forgot-password] Reset email sent successfully',
      { userId: user.idUtilisateur, email: mail }
    );

    return { message: 'Email de réinitialisation envoyé' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;

    this.logger.log('[INFO] [POST /users/reset-password] Password reset attempt');

    let payload;
    try {
      payload = this.authService.verifyResetPasswordToken(token);
    } catch {
      this.logger.warn(
        '[WARN] [POST /users/reset-password] Invalid or expired reset token',
        { token: token?.substring(0, 8) + '...' }
      );
      throw new BadRequestException('Token invalide ou expiré');
    }

    const userId = payload.sub;
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(newPassword, salt);

    await this.usersService.update(userId, { motDePasse: newPassword });

    this.logger.log(
      '[INFO] [POST /users/reset-password] Password reset successful',
      { userId }
    );

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
