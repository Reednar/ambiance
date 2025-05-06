import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentairesService } from '../../services/commentaires/commentaires.service';
import { CommentairesController } from '../../controllers/commentaires/commentaires.controller';
import { Commentaire } from '../../entities/commentaires.entity';
import { UsersService } from 'src/services/users/users.service';
import { PublicationsService } from 'src/services/publications/publications.service';
import { User } from 'src/entities/users.entity';
import { Publication } from 'src/entities/publications.entity';
import { ParticipationModule } from  '../../modules/participation/participation.module';// Importez le module contenant ParticipationRepository
import { Participation } from 'src/entities/participation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commentaire, User, Publication,Participation]), // Définir les entités ici
     // Importez le module contenant ParticipationRepository
  ],
  providers: [CommentairesService, UsersService, PublicationsService], // Ajouter les services nécessaires
  controllers: [CommentairesController],
  exports: [CommentairesService], // Exporter le service si nécessaire
})
export class CommentairesModule {}
