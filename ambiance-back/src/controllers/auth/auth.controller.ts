// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint pour se connecter.
   * En production, tu devrais vérifier le mot de passe et d'autres données.
   */
  @Post('login')
  async login(@Body() body: { mail: string; password: string }) {
    // Simulation d'un utilisateur validé (à remplacer par une vérification réelle)
    if (body.mail && body.password) {
      const user = { mail: body.mail , password: body.password };
      return this.authService.login(user);
    }
    throw new UnauthorizedException('Identifiants invalides');
  }
}
