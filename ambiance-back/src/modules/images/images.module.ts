import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesService } from '../../services/images/images.service';
import { imagesController } from '../../controllers/images/images.controller';
import { Image } from '../../entities/images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])], // Définir l'entité Post ici
  providers: [ImagesService],
  controllers: [imagesController],
  exports: [ImagesService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class ImagesModule {}
