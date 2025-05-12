import { Controller, Get,Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
