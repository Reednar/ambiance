import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('Publications')
export class Post {
  @PrimaryGeneratedColumn({ name: 'IdPublication' })
  idPublication: number;

  @Column({ name: 'CodePostal', type: 'varchar', length: 100, nullable: false })
  codePostal: string;

  @Column({ name: 'rue', type: 'varchar', length: 100, nullable: false })
  rue: string;

  @Column({ name: 'Ville', type: 'varchar', length: 100, nullable: false })
  ville: string;

  @Column({ name: 'Titre', type: 'varchar', length: 50, nullable: false })
  titre: string;

  @Column({ name: 'DateEvenement', type: 'datetime', nullable: false })
  dateEvenement: Date;

  @Column({ name: 'Description', type: 'text', nullable: false })
  description: string;

  @Column({
    name: 'Prix',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  prix: number;

  @Column({ name: 'Lien', type: 'varchar', length: 50, nullable: true })
  lien: string;

  @Column({
    name: 'DateCreation',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreation: Date;

  @Column({ name: 'ParticipantMax', type: 'smallint', nullable: true })
  participantMax: number;

  @Column({ name: 'ParticipantMin', type: 'smallint', nullable: true })
  participantMin: number;

  @Column({
    name: 'TypePost',
    type: 'enum',
    enum: ['Evenement', 'activité'],
    nullable: false,
  })
  typePost: 'Evenement' | 'activité';

  @ManyToOne(() => User, (utilisateur) => utilisateur.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'IdUtilisateur' }) // Mettre la colonne de la clé étrangère
  utilisateur: User;
}
