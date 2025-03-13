import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentairesService } from '../../services/commentaires/commentaires.service';
import { CommentairesController } from '../../controllers/commentaires/commentaires.controller';
import { Commentaire } from '../../entities/commentaires.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commentaire])], // Définir l'entité Commentaire ici
  providers: [CommentairesService],
  controllers: [CommentairesController],
  exports: [CommentairesService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class CommentairesModule {}
