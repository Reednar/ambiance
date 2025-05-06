import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from '../../services/messages/messages.service';
import { Message } from '../../entities/messages.entity';
import { Discussion } from '../../entities/discussions.entity';
import { User } from 'src/entities/users.entity';
import { MessageController } from 'src/controllers/messages/messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Discussion,User])], // Enregistrez les entités ici
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessagesModule {}