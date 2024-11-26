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
import{ UsersController } from './controllers/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { GroupsController } from './controllers/groups/groups.controller';
import { GroupsModule } from './modules/groups/groups.module';
import { Groupe } from './entities/groups.entity';
import { Document } from './entities/documents.entity';
import { DocumentsModule } from './modules/documents/documents.module';
import { Acces } from './entities/acces.entity';
import { AccesModule } from './modules/acces/acces.module';
import { Image } from './entities/images.entity';
import { ImagesModule } from './modules/images/images.module';
import { Avis } from './entities/avis.entity';
import { AvisModule } from './modules/avis/avis.module';
import { Interagis } from './entities/interagis.entity';
import { InteragisModule } from './modules/interagis/interagis.module';
import { Participation } from './entities/participation.entity';
import { ParticipationModule } from './modules/participation/participation.module';


@Module({
  controllers: [AppController, PostsController,UsersController,GroupsController],
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
      entities: [Post, User,Groupe,Document,Acces,Image,Avis,Interagis,Participation], // Ajouter les entités ici
      synchronize: false, // Permet de manipuler les entités de la base de données avec les fichiers entity.ts en temps réel
    }),
    PostsModule,UsersModule,GroupsModule,DocumentsModule,AccesModule,ImagesModule,AvisModule,InteragisModule,ParticipationModule
    // Mettre les autres modules ici
  ],
  providers: [AppService],
})
export class AppModule {}
