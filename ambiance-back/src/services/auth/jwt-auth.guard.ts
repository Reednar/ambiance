import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<import('express').Request>();
    const token = request.cookies?.['access_token'];

    console.log('Token reçu:', token);

    if (!token) {
      console.error('Token manquant');
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('Payload décodé:', payload);

      if (!payload.role) {
        console.log('Récupération du rôle depuis la base de données');
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
          throw new UnauthorizedException('Utilisateur introuvable');
        }
        payload.role = user.role;
      }

      if (payload.role !== 'Administrateur') {
        console.error('Accès refusé: rôle insuffisant');
        throw new UnauthorizedException('Accès refusé: rôle insuffisant');
      }

      request['user'] = payload; // tu peux ensuite récupérer avec @Req()
      return true;
    } catch (e) {
      console.error('Erreur de vérification du token:', e);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}