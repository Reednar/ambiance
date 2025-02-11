import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
