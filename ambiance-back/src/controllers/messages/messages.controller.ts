import { Controller, Get, Post, Body, Param, Patch, Delete,Req, Logger } from '@nestjs/common';
import { MessageService } from '../../services/messages/messages.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService,
    private readonly logger: Logger,
  ) {}

  @Post()
  create(@Body() data: any, @Req() req: Request) {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Creating a new message`,
      { messageData: data }
    );
    return this.messageService.create(data);
  }

  @Get()
  findAll(@Req() req: Request) {
    this.logger.log(`[INFO] [${req.method} ${req.url}] Fetching all messages`);
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Fetching message by ID`,
      { messageId: +id }
    );
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Updating message`,
      { messageId: +id, updateData: data }
    );
    return this.messageService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    this.logger.log(
      `[INFO] [${req.method} ${req.url}] Removing message`,
      { messageId: +id }
    );
    return this.messageService.remove(+id);
  }
}
