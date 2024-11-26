import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessService } from '../../services/acces/acces.service';
import { AccesController } from '../../controllers/acces/acces.controller';
import { Acces } from '../../entities/acces.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Acces])], // Définir l'entité Post ici
  providers: [AccessService],
  controllers: [AccesController],
  exports: [AccessService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class AccesModule {}
