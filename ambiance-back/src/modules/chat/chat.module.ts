import { Module } from '@nestjs/common';
import { ChatGateway } from '../../gateways/chat.gateway';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [MessagesModule], // Importez MessagesModule pour accéder à MessagesService
  providers: [ChatGateway], // Fournissez ChatGateway
  exports: [ChatGateway], // Exportez ChatGateway si nécessaire
})
export class ChatModule {}