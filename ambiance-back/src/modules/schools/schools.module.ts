import { Module,Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolsService } from '../../services/schools/schools.service';
import { MembresBDEService } from '../../services/membresBDE/membresBDE.service';
import { UsersService } from '../../services/users/users.service';
import { SchoolsController } from '../../controllers/schools/schools.controller';
import { School } from '../../entities/schools.entity';
import { MembresBDE } from '../../entities/membresBDE.entity';
import { User } from '../../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([School, MembresBDE, User])],
  providers: [SchoolsService, MembresBDEService,UsersService,Logger],
  controllers: [SchoolsController],
  exports: [SchoolsService, MembresBDEService],
})
export class SchoolsModule {}