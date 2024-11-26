import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImagesService } from '../../services/images/images.service';

@ApiTags('images')
@Controller('images')
export class imagesController {
    constructor(private ImagesService: ImagesService) {}

    @Get()
    @ApiOperation({ summary: 'Return all groups' })
    async getPosts() {
      return await this.ImagesService.findAll();
    }
}
