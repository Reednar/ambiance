import { Module, Logger } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { AuthModule } from '../auth/auth.module';
import { PaiementsService } from 'src/services/paiements/paiements.service';
import { PaiementsController } from 'src/controllers/paiements/paiments.controller';
import Stripe from 'stripe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from 'src/entities/paiements.entity';
import { User } from 'src/entities/users.entity';

const stripeProvider = {
  provide: Stripe,
  useFactory: () => new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-04-30.basil' }),
};

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Paiement, User]),
  ],
  providers: [stripeProvider, PaiementsService, Logger],
  controllers: [PaiementsController],
  exports: [PaiementsService],
})
export class PaiementsModule {}
