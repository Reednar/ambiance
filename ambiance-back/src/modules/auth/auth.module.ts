// src/auth/auth.module.ts
import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../services/auth/auth.service';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { AuthController } from '../../controllers/auth/auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret', // La clé secrète utilisée pour signer les tokens
      signOptions: { expiresIn: '15m' }, // Délai d'expiration par défaut pour l'access token
    }),UsersModule 
  ],
  providers: [AuthService, JwtStrategy,Logger, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
