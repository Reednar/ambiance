import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicationsController } from './controllers/publications/publications.controller';
import { PublicationsModule } from './modules/publications/publications.module';
import { Publication } from './entities/publications.entity';
import { User } from './entities/users.entity';
import { UsersController } from './controllers/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { GroupsController } from './controllers/groups/groups.controller';
import { GroupsModule } from './modules/groups/groups.module';
import { Groupe } from './entities/groups.entity';
import { Image } from './entities/images.entity';
import { ImagesModule } from './modules/images/images.module';
import { Commentaire } from './entities/commentaires.entity';
import { CommentairesModule } from './modules/commentaires/commentaires.module';
import { Participation } from './entities/participation.entity';
import { ParticipationModule } from './modules/participation/participation.module';
import { AuthModule } from './modules/auth/auth.module';
import { Paiement } from './entities/paiements.entity'; // Import Paiement entity
import { Categorie } from './entities/categories.entity';
import { CategoriesController } from './controllers/categories/categories.controller';
import { PublicationCategories } from './entities/publication-categories.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { PublicationCategoriesModule } from './modules/publication-categories/publication-categories.module';
import { PublicationCategoriesController } from './controllers/publication-categories/publication-categories.controller';
import { Message } from './entities/messages.entity';
import { MessagesModule } from './modules/messages/messages.module';
import { Discussion } from './entities/discussions.entity';
import { DiscussionService } from './services/discussion/discussion.service';
import { DiscussionController } from './controllers/discussions/discussions.controller';
//websocket 
import { ChatGateway } from './gateways/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { MessageService } from './services/messages/messages.service';
import { DiscussionModule } from './modules/discussions/discussions.module';

@Module({
  controllers: [
    AppController,
    PublicationsController,
    UsersController,
    GroupsController,
    CategoriesController,
    PublicationCategoriesController
    DiscussionController,
  ],
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306, // Port par défaut pour MySQL
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Publication,
        User,
        Groupe,
        Image,
        Categorie,
        PublicationCategories,
        Commentaire,
        Participation,
        Paiement,
        Discussion,
        Message,      
      ], // Ajouter les entités ici
      synchronize: false, // Permet de manipuler les entités de la base de données avec les fichiers entity.ts en temps réel
    }),
    PublicationsModule,
    UsersModule,
    GroupsModule,
    ImagesModule,
    CommentairesModule,
    ParticipationModule,
    AuthModule,
    CategoriesModule,
    PublicationCategoriesModule
    DiscussionModule,
    MessagesModule,
    ChatModule,
    // Mettre les autres modules ici
  ],
  providers: [AppService],
})
export class AppModule {}
