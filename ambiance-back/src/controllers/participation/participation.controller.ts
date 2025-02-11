import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParticipationService } from '../../services/participation/participation.service';

@ApiTags('participation')
@Controller('participation')
export class ParticipationController {
  constructor(private ParticipationService: ParticipationService) {}

  @Get()
  @ApiOperation({ summary: 'Return all participation' })
  async getPosts() {
    return await this.ParticipationService.findAll();
  }
}
