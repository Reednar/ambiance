import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InteragisService } from '../../services/interagis/interagis.service';

@ApiTags('interagis')
@Controller('interagis')
export class interagisController {
    constructor(private InteragisService: InteragisService) {}

    @Get()
    @ApiOperation({ summary: 'Return all interagis' })
    async getPosts() {
      return await this.InteragisService.findAll();
    }
}
