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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/users.entity';
import bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
const bcrypt = require('bcrypt');

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('findAll')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Return all Users if the requester is an admin' })
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
          },
        ],
      },
    },
  })
  async findAll(@Body() body: { userId: number }): Promise<User[]> {
    const user = await this.usersService.findOne(body.userId);

    if (!user || user.role !== 'Administrateur') {
      throw new HttpException(
        'Access denied: Only administrators can access this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post("create")
  @ApiOperation({ summary: 'Create a new User' })
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
