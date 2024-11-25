import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from '../../services/documents/documents.service';
import { DocumentsController } from '../../controllers/Documents/document.controller';
import { Document } from '../../entities/documents.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])], // Définir l'entité Post ici
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class DocumentsModule {}
