import { Logger, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../../services/users/users.service';
import { UsersController } from '../../controllers/users/users.controller';
import { User } from '../../entities/users.entity';
import { School } from 'src/entities/schools.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, School]), forwardRef(() => AuthModule)],
  providers: [UsersService, Logger],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
