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
import { DiscussionService } from '../services/discussion/discussion.service';
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
    private readonly discussionService: DiscussionService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Discussion)
    private readonly discussionRepository: Repository<Discussion>,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const userId = parseInt(client.handshake.query.userId as string, 10);
      if (!userId) {
        client.disconnect();
        return;
      }

      // Récupérer les discussions liées aux groupes de l'utilisateur
      const discussions = await this.discussionService.findGroupNamesAndDiscussionIdsByUser(userId);

      // Ajouter l'utilisateur dans les rooms correspondant à ses groupes
      discussions.forEach((discussion) => {
        client.join(`room-${discussion.idDiscussion}`);
      });

      console.log(`Client connecté : ${client.id}, utilisateur : ${userId}`);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    payload: { senderId: number; discussionId: number; content: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      // Vérifier si l'utilisateur appartient au groupe
      const discussions = await this.discussionService.findGroupNamesAndDiscussionIdsByUser(payload.senderId);
      const isMember = discussions.some((discussion) => discussion.idDiscussion === payload.discussionId);

      if (!isMember) {
        console.error("Vous n'appartenez pas à ce groupe.");
      }

      // Sauvegarder le message en base de données
      const savedMessage = await this.messageService.create({
        contenu: payload.content,
        idUtilisateur: payload.senderId,
        idDiscussion: payload.discussionId,
      });

      console.log('Message sauvegardé :', savedMessage);

      // Diffuser le message aux membres de la room
      this.server.to(`room-${payload.discussionId}`).emit('receiveMessage', savedMessage);
    } catch (error) {
      console.error('Erreur lors de l’envoi du message :', error.message);
      client.emit('errorMessage', { message: error.message });
    }
  }
}