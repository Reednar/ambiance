import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from '../../services/groups/groups.service';
import { GroupsController } from '../../controllers/groups/groups.controller';
import { Groupe } from '../../entities/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Groupe])], // Définir l'entité Post ici
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class GroupsModule {}
