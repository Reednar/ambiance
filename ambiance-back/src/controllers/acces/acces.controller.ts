import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessService } from '../../services/acces/acces.service';

@ApiTags('acces')
@Controller('acces')
export class AccesController {
    constructor(private AccesService: AccessService) {}

    @Get()
    @ApiOperation({ summary: 'Return all acces' })
    async getPosts() {
      return await this.AccesService.findAll();
    }
}
