import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];  // 'jwt' : le nom de ton cookie contenant le token
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access_token') {
  private readonly logger = new Logger("JwtStrategy");

  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'testsecret',
    });
    this.logger.log('JwtStrategy initialized');
  }

  async validate(payload: any) {
    this.logger.log(`Validating JWT payload: ${JSON.stringify(payload)}`);
    return { userId: payload.sub, username: payload.username };
  }
}
