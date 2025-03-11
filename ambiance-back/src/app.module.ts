import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './controllers/posts/posts.controller';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './entities/posts.entity';
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

@Module({
  controllers: [
    AppController,
    PostsController,
    UsersController,
    GroupsController,
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
        Post,
        User,
        Groupe,
        Image,
        Commentaire,
        Participation,
        Paiement, // Add Paiement entity here
      ], // Ajouter les entités ici
      synchronize: false, // Permet de manipuler les entités de la base de données avec les fichiers entity.ts en temps réel
    }),
    PostsModule,
    UsersModule,
    GroupsModule,
    ImagesModule,
    CommentairesModule,
    ParticipationModule,
    AuthModule,
    // Mettre les autres modules ici
  ],
  providers: [AppService],
})
export class AppModule {}
