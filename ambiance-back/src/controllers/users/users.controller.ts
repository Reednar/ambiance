import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../services/users/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Return all Users' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    examples: {
      example1: {
        summary: 'Successful response example',
        value: [
          {
            idUtilisateur: 1,
            prenom: 'test',
            nom: 'test',
            pseudo: 'test',
            dateDeNaissance: '2024-11-06T10:36:19.000Z',
            description: 'Scary movie',
            genre: 'Homme',
            mail: 'test@test.com',
            motDePasse: 'azerty',
            role: 'Utilisateur',
            telephone: "0123456789",
            rib: 'fr7612345678901234567890123',
          },
        ],
      },
    },
  })
  async getPosts() {
    return await this.UsersService.findAll();
  }

}
