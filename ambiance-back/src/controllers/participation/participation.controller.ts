import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParticipationService } from '../../services/participation/participation.service';

@ApiTags('participation')
@Controller('participation')
export class participationController {
    constructor(private ParticipationService: ParticipationService) {}

    @Get()
    @ApiOperation({ summary: 'Return all participation' })
    async getPosts() {
      return await this.ParticipationService.findAll();
    }
}
