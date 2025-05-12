import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationsService } from '../../services/publications/publications.service';
import { PublicationsController } from '../../controllers/publications/publications.controller';
import { Publication } from '../../entities/publications.entity';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/users.entity';
import { PublicationCategoriesModule } from '../publication-categories/publication-categories.module';
import { GroupsModule } from '../groups/groups.module';
import { ParticipationModule } from '../participation/participation.module';
import { Groupe } from 'src/entities/groups.entity';
import { Participation } from 'src/entities/participation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, Participation, Groupe, User]), // Assure-toi d'ajouter toutes les entités nécessaires
    PublicationCategoriesModule,
    ParticipationModule,
    forwardRef(() => GroupsModule), // Pour éviter la dépendance circulaire
  ],
  providers: [PublicationsService, UsersService],
  controllers: [PublicationsController],
  exports: [PublicationsService, UsersService],
})
export class PublicationsModule {}
