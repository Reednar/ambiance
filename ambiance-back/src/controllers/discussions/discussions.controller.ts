import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { DiscussionService } from './../../services/discussion/discussion.service';
import { MessageService } from './../../services/messages/messages.service'; // Import du service MessageService
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('discussions')
export class DiscussionController {
  constructor(
    private readonly discussionService: DiscussionService,
    private readonly messageService: MessageService, // Injection du service MessageService
  ) {}

  @Post("create")
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'create a discussion' }) 
  create(@Body() data: any) {// mettre une protection pour une conversation par groupe
    return this.discussionService.create(data);
  }

  @Get()
  findAll() {
    return this.discussionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.discussionService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discussionService.remove(+id);
  }

  @Post('user-discussions')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all discussions for groups the user is part of' })
  async getUserDiscussions(@Body() body: { userId: number }) {
    return this.discussionService.findGroupNamesAndDiscussionIdsByUser(body.userId);
  }

  @Post('messages-history')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get message history for a discussion' })
  async getMessagesHistory(@Body() body: { discussionId: number }) {
    return this.messageService.findMessagesByDiscussion(body.discussionId);
  }
}
