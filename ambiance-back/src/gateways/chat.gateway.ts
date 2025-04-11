import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../services/messages/messages.service';
import { User } from '../entities/users.entity';
import { Discussion } from '../entities/discussions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Discussion)
    private readonly discussionRepository: Repository<Discussion>,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    payload: { senderId: number; discussionId: number; content: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOneByOrFail({ idUtilisateur: payload.senderId });
      const discussion = await this.discussionRepository.findOneByOrFail({ idDiscussion: payload.discussionId });

      const savedMessage = await this.messageService.create({
        contenu: payload.content,
        idUtilisateur: user.idUtilisateur, 
        idDiscussion: discussion.idDiscussion,  
      });
      
      console.log('Message sauvegardé :', savedMessage);

      //this.server.emit('receiveMessage', savedMessage);
      client.emit("receiveMessage", "ah gros on est la ");
    } catch (error) {
      console.error('Erreur lors de l’envoi du message :', error.message);
      client.emit('errorMessage', { message: error.message });
    }
  }

  handleConnection(client: Socket): void {
    console.log(`Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client déconnecté : ${client.id}`);
  }
}