import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from '../../services/groups/groups.service';
import { GroupsController } from '../../controllers/groups/groups.controller';
import { Groupe } from '../../entities/groups.entity';
import { Participation } from '../../entities/participation.entity';
import { User } from '../../entities/users.entity';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groupe, Participation, User]),
    UsersModule,
    PostsModule,
  ],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
