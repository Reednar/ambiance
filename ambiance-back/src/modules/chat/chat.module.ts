import { Module } from '@nestjs/common';
import { ChatGateway } from '../../gateways/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../../entities/messages.entity';
import { User } from '../../entities/users.entity';
import { Discussion } from '../../entities/discussions.entity';
import { MessageService } from '../../services/messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Discussion]),
  ],
  providers: [ChatGateway, MessageService],
})
export class ChatModule {}
