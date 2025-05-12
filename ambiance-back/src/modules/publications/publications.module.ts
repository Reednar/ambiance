import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationsService } from '../../services/publications/publications.service';
import { PublicationsController } from '../../controllers/publications/publications.controller';
import { Publication } from '../../entities/publications.entity';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/users.entity';
import { Participation } from 'src/entities/participation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, User, Participation])], // Définir l'entité Publication ici
  providers: [PublicationsService, UsersService,Logger], // Mettre les services ici
  controllers: [PublicationsController],
  exports: [PublicationsService, UsersService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class PublicationsModule {}
