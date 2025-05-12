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
    // Configure Passport pour utiliser la stratégie JWT par défaut
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configure le module JWT avec une clé secrète et une durée d'expiration
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // Idéalement stockée dans une variable d'environnement
      signOptions: { expiresIn: '1h' }, // Le token expirera dans 1 heure
    }),UsersModule 
  ],
  providers: [AuthService, JwtStrategy,Logger],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
