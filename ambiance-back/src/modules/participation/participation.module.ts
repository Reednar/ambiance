import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationService } from '../../services/participation/participation.service';
import { ParticipationController } from '../../controllers/participation/participation.controller';
import { Participation } from '../../entities/participation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participation])], // Définir l'entité Post ici
  providers: [ParticipationService],
  controllers: [ParticipationController],
  exports: [ParticipationService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class ParticipationModule {}
