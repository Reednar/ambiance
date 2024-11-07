import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from '../../services/posts/posts.service';
import { PostsController } from '../../controllers/posts/posts.controller';
import { Post } from '../../entities/posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])], // Définir l'entité Post ici
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class PostsModule {}