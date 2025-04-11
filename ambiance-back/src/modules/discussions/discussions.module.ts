import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscussionService } from '../../services/discussion/discussion.service';
import { DiscussionController } from '../../controllers/discussions/discussions.controller';
import { Discussion } from '../../entities/discussions.entity';
import { Groupe } from '../../entities/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion, Groupe])],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService], // utile si tu veux l'utiliser ailleurs
})
export class DiscussionModule {}
