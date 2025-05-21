import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscussionService } from '../../services/discussion/discussion.service';
import { DiscussionController } from '../../controllers/discussions/discussions.controller';
import { Discussion } from '../../entities/discussions.entity';
import { Groupe } from '../../entities/groups.entity';
import { Participation } from '../../entities/participation.entity'; // Import de l'entité Participation
import { MessageService } from 'src/services/messages/messages.service';
import { Message } from 'src/entities/messages.entity';
import { User } from 'src/entities/users.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion, Groupe, Participation,Message,User,]),AuthModule], // Ajout de Participation
  controllers: [DiscussionController],
  providers: [DiscussionService,MessageService,Logger],
  exports: [DiscussionService], // utile si tu veux l'utiliser ailleurs
})
export class DiscussionModule {}
