import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisService } from '../../services/avis/avis.service';
import { avisController } from '../../controllers/avis/avis.controller';
import { Avis } from '../../entities/avis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avis])], // Définir l'entité Post ici
  providers: [AvisService],
  controllers: [avisController],
  exports: [AvisService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class AvisModule {}
