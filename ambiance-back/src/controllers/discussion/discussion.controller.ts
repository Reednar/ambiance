import { Controller, Post, Body } from '@nestjs/common';
import { MessagesService } from '../../services/messages/messages.service';

@Controller('discussion')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('messages')
  async getMessages(@Body() body: { discussionId: number }) {
    return await this.messagesService.findByDiscussion(body.discussionId);
  }

  @Post('create')
  async createDiscussion(@Body() body: { title: string; participants: number[] }) {
    return await this.messagesService.createDiscussion(body.title, body.participants);
  }

  @Post('update')
  async updateDiscussion(@Body() body: { id: number; title?: string; participants?: number[] }) {
    return await this.messagesService.updateDiscussion(body.id, body);
  }

  @Post('delete')
  async deleteDiscussion(@Body() body: { id: number }) {
    return await this.messagesService.deleteDiscussion(body.id);
  }

  @Post('getById')
  async getDiscussionById(@Body() body: { id: number }) {
    return await this.messagesService.findDiscussionById(body.id);
  }

  @Post('getAll')
  async getAllDiscussions() {
    return await this.messagesService.findAllDiscussions();
  }
}