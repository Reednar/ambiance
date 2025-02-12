import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from '../../services/posts/posts.service';
import { PostsController } from '../../controllers/posts/posts.controller';
import { Post } from '../../entities/posts.entity';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post,User])], // Définir l'entité Post ici
  providers: [PostsService, UsersService], // Mettre les services ici
  controllers: [PostsController],
  exports: [PostsService, UsersService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class PostsModule {}
