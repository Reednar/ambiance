import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/users.entity';
import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
            telephone: '0123456789',
            rib: 'fr7612345678901234567890123',
          },
        ],
      },
    },
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() body: { 
    prenom: string,
    nom: string,
    dateDeNaissance: Date,
    genre: 'Homme'| 'Femme'|'Autre',
    mail: string;
    motDePasse: string,
    telephone: string,
    pays: string,
   }) {
    var futureUser ={ ...body, role: 'Utilisateur' } as User;

    //hashage du mot de passe
    var password = futureUser.motDePasse;
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => {
      if (err) throw new HttpException('Error generating salt', HttpStatus.INTERNAL_SERVER_ERROR);
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw new HttpException('Error hashing password', HttpStatus.INTERNAL_SERVER_ERROR);
        futureUser.motDePasse = hash;
        const createdUser = await this.usersService.create(futureUser);
        return createdUser;
      });
    });
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
