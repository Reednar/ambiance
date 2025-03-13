import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentairesService } from '../../services/commentaires/commentaires.service';

@ApiTags('commentaires')
@Controller('commentaires')
export class CommentairesController {
  constructor(private commentairesService: CommentairesService) {}

  @Get()
  @ApiOperation({ summary: 'Return all commentaires' })
  async getCommentaires() {
    return await this.commentairesService.findAll();
  }
}
