import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from '../../services/messages/messages.service';
import { Message } from '../../entities/messages.entity';
import { Discussion } from '../../entities/discussions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Discussion])], // Enregistrez les entités ici
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}