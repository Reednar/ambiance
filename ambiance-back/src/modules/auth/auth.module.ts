// src/modules/auth/auth.module.ts
import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from '../../services/auth/auth.service';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { AuthController } from '../../controllers/auth/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule, // Assure-toi que c'est bien importé ici
    JwtModule.registerAsync({
      imports: [ConfigModule], // <- obligatoire ici
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // <- c’est ici que ça charge le .env
        signOptions: { expiresIn: '15m' },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, Logger, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtStrategy,
    JwtModule,      // 👈 exporte-le
    JwtAuthGuard], // <--- exporter JwtStrategy ici
})
export class AuthModule {}
