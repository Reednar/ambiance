import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AvisService } from '../../services/avis/avis.service';

@ApiTags('avis')
@Controller('avis')
export class avisController {
    constructor(private AvisService: AvisService) {}

    @Get()
    @ApiOperation({ summary: 'Return all groups' })
    async getPosts() {
      return await this.AvisService.findAll();
    }
}
