import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Post } from './posts.entity'; // Chemin à ajuster selon votre projet
  
  @Entity('Images') // Correspond au nom de la table
  export class Image {
    @PrimaryGeneratedColumn({ name: 'IdImage' })
    idImage: number;
  
    @Column({ name: 'LienImage', type: 'blob', nullable: false })
    lienImage: Buffer;
  
    @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'IdPublication' })
    publication: Post;
  }
  