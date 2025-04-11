import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { DiscussionService } from './../../services/discussion/discussion.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('discussions')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post("create")
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'create a discussion'}) 
  create(@Body() data: any) {
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
}
