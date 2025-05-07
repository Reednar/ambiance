import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from '../../services/groups/groups.service';
import { GroupsController } from '../../controllers/groups/groups.controller';
import { Groupe } from '../../entities/groups.entity';
import { Participation } from '../../entities/participation.entity';
import { User } from '../../entities/users.entity';
import { UsersModule } from '../users/users.module';
import { PublicationsModule } from '../publications/publications.module';
import { UsersService } from 'src/services/users/users.service';
import { PublicationsService } from 'src/services/publications/publications.service';
import { Publication } from 'src/entities/publications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groupe, Participation, User,Publication]),
    UsersModule,
    PublicationsModule,
  ],
  providers: [GroupsService,Logger,UsersService,PublicationsService],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
