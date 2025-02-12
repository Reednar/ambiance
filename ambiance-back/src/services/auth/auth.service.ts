// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly UsersService: UsersService) {}

  /**
   * Méthode de login qui, après vérification des identifiants,
   * retourne un token JWT signé.
   */
  async login(user: any) {
    // Dans un cas réel, tu vérifierais ici les identifiants via un UsersService
    const Visitor = await this.UsersService.findOneByMail(user.mail);
    Visitor.motDePasse == user.password;
    if( Visitor == null || Visitor == undefined|| Visitor.motDePasse != user.password){
      throw new UnauthorizedException('Identifiants invalides');
    }
    if (!user || !user.mail) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    // Crée le payload du token
    const payload = { mail: user.mail, sub: Visitor.idUtilisateur };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
