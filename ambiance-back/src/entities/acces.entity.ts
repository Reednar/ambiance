import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Post } from './posts.entity'; // Chemin à ajuster selon votre projet
  
  @Entity('Acces') // Correspond au nom de la table
  export class Acces {
    @PrimaryGeneratedColumn({ name: 'IdAcces' })
    idAcces: number;
  
    @Column({ name: 'Ascenseur', type: 'boolean', default: false })
    ascenseur: boolean;
  
    @Column({ name: 'Rampe', type: 'boolean', default: false })
    rampe: boolean;
  
    @Column({ name: 'PlaceHandicape', type: 'boolean', default: false })
    placeHandicape: boolean;
  
    @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'IdPublication' })
    publication: Post;
  }
  