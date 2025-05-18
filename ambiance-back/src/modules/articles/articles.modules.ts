import { Module,Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../../entities/articles.entity';
import { Tag } from '../../entities/tag.entity';
import { User } from '../../entities/users.entity';
import { ArticleService } from '../../services/articles/articles.services';
import { ArticlesController } from '../../controllers/articles/articles.controllers';
import { TagService } from '../../services/tags/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, User])],
  providers: [ArticleService, TagService,Logger],
  controllers: [ArticlesController],
  exports: [ArticleService],
})
export class ArticlesModule {}