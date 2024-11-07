import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupsService } from '../../services/groups/groups.service';
@ApiTags('groups')
@Controller('groups')
export class GroupsController {
    constructor(private GroupsService: GroupsService) {}

    @Get()
    @ApiOperation({ summary: 'Return all groups' })
    async getPosts() {
      return await this.GroupsService.findAll();
    }
}
