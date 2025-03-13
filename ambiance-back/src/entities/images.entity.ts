import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Publication } from './publications.entity'; // Chemin à ajuster selon votre projet

@Entity('Images') // Correspond au nom de la table
export class Image {
  @PrimaryGeneratedColumn({ name: 'IdImage' })
  idImage: number;

  @Column({ name: 'LienImage', type: 'blob', nullable: false })
  lienImage: Buffer;

  @ManyToOne(() => Publication, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'IdPublication' })
  publication: Publication;
}
