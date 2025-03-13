// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extraction du token depuis le header Authorization (format Bearer)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  /**
   * La méthode validate est appelée automatiquement lorsque le token est valide.
   * Elle retourne le contenu du payload qui sera accessible dans req.user.
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
