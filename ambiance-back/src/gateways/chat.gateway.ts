// filepath: ambiance-back/src/gateways/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../services/messages/messages.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() message: { senderId: number; discussionId: number; content: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // Fetch the User and Discussion entities
    const user = await this.messagesService.getUserById(message.senderId);
    const discussion = await this.messagesService.getDiscussionById(message.discussionId);

    if (!user || !discussion) {
      throw new Error('User or Discussion not found');
    }

    // Save the message in the database
    const savedMessage = await this.messagesService.create({
      contenu: message.content,
      idUtilisateur: user, // Pass the full User entity
      idDiscussion: discussion, // Pass the full Discussion entity
    });

    // Broadcast the message to all connected clients
    this.server.emit('receiveMessage', savedMessage);
  }

  handleConnection(client: Socket): void {
    console.log(`Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client déconnecté : ${client.id}`);
  }
}