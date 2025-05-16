import { forwardRef, Module, Logger } from '@nestjs/common';
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
import { AuthModule } from '../auth/auth.module';  // <-- importer AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, Participation, Groupe, User]),
    PublicationCategoriesModule,
    ParticipationModule,
    forwardRef(() => GroupsModule),
    AuthModule,  // <-- ajouter ici
  ],
  providers: [PublicationsService, UsersService, Logger],
  controllers: [PublicationsController],
  exports: [PublicationsService, UsersService],
})
export class PublicationsModule {}
