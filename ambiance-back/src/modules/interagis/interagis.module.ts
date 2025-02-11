import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteragisService } from '../../services/interagis/interagis.service';
import { interagisController } from '../../controllers/interagis/interagis.controller';
import { Interagis } from '../../entities/interagis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interagis])], // Définir l'entité Post ici
  providers: [InteragisService],
  controllers: [interagisController],
  exports: [InteragisService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class InteragisModule {}
