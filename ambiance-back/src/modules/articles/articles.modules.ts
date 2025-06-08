import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../../entities/articles.entity';
import { Tag } from '../../entities/tag.entity';
import { User } from '../../entities/users.entity';
import { ArticleService } from '../../services/articles/articles.services';
import { ArticlesController } from '../../controllers/articles/articles.controllers';
import { TagService } from '../../services/tags/tags.service';
import { AuthModule } from '../auth/auth.module';
import { SchoolsModule } from '../schools/schools.module';
import { UsersService } from 'src/services/users/users.service';
import { Groupe } from '../../entities/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, User, Groupe]), AuthModule, SchoolsModule],
  providers: [ArticleService, TagService, Logger, UsersService],
  controllers: [ArticlesController],
  exports: [ArticleService],
})
export class ArticlesModule {}