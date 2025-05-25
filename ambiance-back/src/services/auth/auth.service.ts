// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'; // Pour manipuler les JWT

@Injectable()
export class AuthService {
  private readonly refreshTokens = new Set<string>(); // Stockage en mémoire pour les tokens

  constructor(
    private readonly jwtService: JwtService,
    private readonly UsersService: UsersService,
  ) {}
  private secret = process.env.JWT_SECRET || 'secretkey';

  /**
   * Méthode de login qui, après vérification des identifiants,
   * retourne un token JWT signé.
   */
  async login(user: any) {
    const Visitor = await this.UsersService.findOneByMail(user.mail);
    if (!Visitor) {
      throw new UnauthorizedException('Mail invalide');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      Visitor.motDePasse,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe invalide');
    }

    const payload = { mail: user.mail, sub: Visitor.idUtilisateur };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Stocker le refresh token
    this.refreshTokens.add(refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      idUtilisateur: Visitor.idUtilisateur,
      emailConfirmed: Visitor.emailConfirmed,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const newAccessToken = this.jwtService.sign(
        { userId: payload.sub },
        { expiresIn: '15m' },
      );
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // Invalider le refresh token
    const isTokenRemoved = this.invalidateRefreshToken(refreshToken);
    if (!isTokenRemoved) {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }

  private invalidateRefreshToken(token: string): boolean {
    if (this.refreshTokens.has(token)) {
      this.refreshTokens.delete(token);
      return true;
    }
    return false;
  }

  // Méthode pour vérifier la validité du token
  async verifyToken(token: string): Promise<any> {
    try {
      // Vérifie la signature et l'expiration du token avec la clé secrète
      const decoded = await this.jwtService.verifyAsync(token); // Utilisation de verifyAsync pour les tokens JWT
      return decoded; // Retourne le payload du token si valide
    } catch (error) {
      // Si le token est invalide ou expiré, lance une exception
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  generateResetPasswordToken(userId: number): string {
    // Génère un JWT valable 24h
    return jwt.sign({ sub: userId }, this.secret, { expiresIn: '24h' });
  }

  verifyResetPasswordToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      throw new Error('Token invalide ou expiré');
    }
  }
}
