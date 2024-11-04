import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("endpoint")
@Controller("endpoint")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Return hello world'})
  @ApiResponse({ status: 200, description: 'Successful response' })
  getHello() {
    return this.appService.getHello();
  }
}
