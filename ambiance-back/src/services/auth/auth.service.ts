// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly UsersService: UsersService) {}

  /**
   * Méthode de login qui, après vérification des identifiants,
   * retourne un token JWT signé.
   */
  async login(user: any) {
    // Vérifiez les identifiants via UsersService
    const Visitor = await this.UsersService.findOneByMail(user.mail);
    if (!Visitor) {
      throw new UnauthorizedException('mail invalides');
    }

    // Comparez le mot de passe fourni avec le mot de passe chiffré stocké
    const isPasswordValid = await bcrypt.compare(user.password, Visitor.motDePasse);
    if (!isPasswordValid) {
      throw new UnauthorizedException('mot de passe invalides');
    }

    // Créez le payload du token
    const payload = { mail: user.mail, sub: Visitor.idUtilisateur };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const newAccessToken = this.jwtService.sign({ userId: payload.sub }, { expiresIn: '15m' });
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }
}
