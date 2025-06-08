import { Logger, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../../services/users/users.service';
import { UsersController } from '../../controllers/users/users.controller';
import { User } from '../../entities/users.entity';
import { School } from 'src/entities/schools.entity';
import { AuthModule } from '../auth/auth.module';
import { MailService } from 'src/services/mail.service';
import { Groupe } from '../../entities/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, School, Groupe]), forwardRef(() => AuthModule)],
  providers: [UsersService, Logger, MailService],
  controllers: [UsersController],
  exports: [UsersService, MailService],
})
export class UsersModule {}
