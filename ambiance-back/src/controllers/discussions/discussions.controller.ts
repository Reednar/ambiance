import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Logger, Req } from '@nestjs/common';
import { DiscussionService } from './../../services/discussion/discussion.service';
import { MessageService } from './../../services/messages/messages.service'; // Import du service MessageService
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';


@Controller('discussions')
export class DiscussionController {
  constructor(
    private readonly discussionService: DiscussionService,
    private readonly messageService: MessageService, // Injection du service MessageService
    private readonly logger: Logger, // Injection du logger
  ) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'create a discussion' }) 
  create(@Body() data: any, @Req() req: Request) { // Ajout de @Req pour obtenir la route
    this.logger.log(`[${req.method} ${req.url}] Creating a new discussion`, data);
    return this.discussionService.create(data);
  }

  @Get()
  findAll(@Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching all discussions`);
    return this.discussionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching discussion with ID: ${id}`);
    return this.discussionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Removing discussion with ID: ${id}`);
    return this.discussionService.remove(+id);
  }

  @Post('user-discussions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all discussions for groups the user is part of' })
  async getUserDiscussions(@Body() body: { userId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching discussions for user`, body.userId);
    return this.discussionService.findGroupNamesAndDiscussionIdsByUser(body.userId);
  }

  @Post('messages-history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get message history for a discussion' })
  async getMessagesHistory(@Body() body: { discussionId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching message history for discussion`, body.discussionId);
    return this.messageService.findMessagesByDiscussion(body.discussionId);
  }

  @Post('publication-id')
  @ApiOperation({ summary: 'Get publication id by discussion id' })
  async getPublicationIdByDiscussionId(@Body() body: { discussionId: number }, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching publicationId for discussionId: ${body.discussionId}`);
    return this.discussionService.getPublicationIdByDiscussionId(body.discussionId);
  }

  @Get('publication-id/:discussionId')
  @ApiOperation({ summary: 'Get publication id by discussion id via GET' })
  async getPublicationIdByDiscussionIdGet(@Param('discussionId') discussionId: string, @Req() req: Request) {
    this.logger.log(`[${req.method} ${req.url}] Fetching publicationId for discussionId: ${discussionId}`);
    return this.discussionService.getPublicationIdByDiscussionId(+discussionId);
  }

  
}