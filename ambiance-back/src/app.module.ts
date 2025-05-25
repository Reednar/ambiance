import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
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
import { DiscussionController } from './controllers/discussions/discussions.controller';
//websocket
import { ChatModule } from './modules/chat/chat.module';
import { DiscussionModule } from './modules/discussions/discussions.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { SchoolsController } from './controllers/schools/schools.controller';
import { School } from './entities/schools.entity';
import { MembresBDE } from './entities/membresBDE.entity';
import { Tag } from './entities/tag.entity';
import { Article } from './entities/articles.entity';
import { ArticlesModule } from './modules/articles/articles.modules';
import { DataSource } from 'typeorm';
import { PaiementsModule } from './modules/paiements/paiements.module';

@Module({
  controllers: [
    AppController,
    PublicationsController,
    UsersController,
    GroupsController,
    CategoriesController,
    PublicationCategoriesController,
    DiscussionController,
    SchoolsController,
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
        School,
        MembresBDE,
        Tag,
        Article,
      ], // Ajouter les entités ici
      synchronize: false, // Permet de manipuler les entités de la base de données avec les fichiers entity.ts en temps réel
      extra: {
        connectionLimit: 5, // Limite le nombre de connexions simultanées pour éviter l'erreur
      },
    }),
    PublicationsModule,
    UsersModule,
    GroupsModule,
    CommentairesModule,
    ParticipationModule,
    AuthModule,
    CategoriesModule,
    PublicationCategoriesModule,
    DiscussionModule,
    MessagesModule,
    ChatModule,
    SchoolsModule,
    ArticlesModule,
    PaiementsModule,
  ],
  providers: [AppService, Logger],
})
export class AppModule implements OnApplicationShutdown {
  constructor(private readonly dataSource: DataSource) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(_signal?: string) {
    await this.dataSource.destroy();
  }
}
