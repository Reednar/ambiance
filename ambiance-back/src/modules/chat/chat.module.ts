import { Module } from '@nestjs/common';
import { ChatGateway } from '../../gateways/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../../entities/messages.entity';
import { User } from '../../entities/users.entity';
import { Discussion } from '../../entities/discussions.entity';
import { MessageService } from '../../services/messages/messages.service';
import { DiscussionModule } from '../discussions/discussions.module'; // Import du module Discussion

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Discussion]),
    DiscussionModule, // Ajout du module Discussion pour fournir DiscussionService
  ],
  providers: [ChatGateway, MessageService],
})
export class ChatModule {}
