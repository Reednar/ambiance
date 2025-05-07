// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly logger : Logger, // Logger pour le controller;
  ) {}

  /**
   * Endpoint pour se connecter.
   * En production, tu devrais vérifier le mot de passe et d'autres données.
   */
  @Post('login')
  async login(@Body() body: { mail: string; password: string }) {
    this.logger.log('/auth/login called'); // Log de la requête
    if (body.mail && body.password) {
      const user = { mail: body.mail, password: body.password };
      const loginResponse = await this.authService.login(user);

      // Ajout de l'idUtilisateur dans la réponse
      return {
        access_token: loginResponse.access_token,
        refresh_token: loginResponse.refresh_token,
        idUtilisateur: loginResponse.idUtilisateur, // Inclure l'idUtilisateur
      };
    }
    throw new UnauthorizedException('Identifiants invalides');
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') token: string) {
    this.logger.log('/auth/refresh called');
    try {
      return await this.authService.refreshToken(token);
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }

  @Post('logout')
  async logout(@Body('refreshToken') token: string) {
    this.logger.log('/auth/logout called');
    try {
      await this.authService.logout(token);
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      throw new UnauthorizedException('Erreur lors de la déconnexion');
    }
  }
}
