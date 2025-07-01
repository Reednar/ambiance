import { Controller, Get, Logger, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParticipationService } from '../../services/participation/participation.service';

@ApiTags('participation')
@Controller('participation')
export class ParticipationController {
  private readonly logger = new Logger(ParticipationController.name);

  constructor(private ParticipationService: ParticipationService) {}

  @Get()
  @ApiOperation({ summary: 'Retourne toutes les participations' })
  async getPosts(@Req() req?: Request) {
    this.logger.log('[INFO] [GET /participation] Fetching all participations');
    return await this.ParticipationService.findAll();
  }
}
