import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationService } from '../../services/participation/participation.service';
import { ParticipationController } from '../../controllers/participation/participation.controller';
import { Participation } from '../../entities/participation.entity';
import { Logger } from 'winston';

@Module({
  imports: [TypeOrmModule.forFeature([Participation])],
  providers: [ParticipationService, Logger],
  controllers: [ParticipationController],
  exports: [ParticipationService], // C'est ici que le service est exporté
})
export class ParticipationModule {}
