// jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload; // tu peux ensuite récupérer avec @Req()
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
