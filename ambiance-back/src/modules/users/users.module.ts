import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../../services/users/users.service';
import { UsersController } from '../../controllers/users/users.controller';
import { User } from '../../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Définir l'entité Post ici
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class UsersModule {}
