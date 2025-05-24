import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParticipationService } from '../../services/participation/participation.service';

@ApiTags('participation') // Tag Swagger pour catégoriser les endpoints sous "participation"
@Controller('participation') // Route de base pour ce contrôleur
export class ParticipationController {
  constructor(private ParticipationService: ParticipationService) {}

  // Endpoint GET /participation pour récupérer toutes les participations
  @Get()
  @ApiOperation({ summary: 'Retourne toutes les participations' })
  async getPosts() {
    return await this.ParticipationService.findAll();
  }
}
