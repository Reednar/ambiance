import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from '../../services/documents/documents.service';
@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private DocumentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Return all groups' })
  async getPosts() {
    return await this.DocumentsService.findAll();
  }
}
