import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './users.entity';
import { PublicationCategories } from './publication-categories.entity';
import { School } from './schools.entity';

@Entity('Publications')
export class Publication {
  @PrimaryGeneratedColumn({ name: 'IdPublication' })
  idPublication: number;

  @Column({ name: 'CodePostal', type: 'varchar', length: 100, nullable: false })
  codePostal: string;

  @Column({ name: 'Rue', type: 'varchar', length: 100, nullable: false })
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

  @Column({ name: 'PlaceHandicape', type: 'boolean', nullable: false })
  placeHandicape: boolean;

  @Column({ name: 'Rampe', type: 'boolean', nullable: false })
  rampe: boolean;

  @Column({ name: 'Ascenseur', type: 'boolean', nullable: false })
  ascenseur: boolean;

  @Column({ type: 'longblob', nullable: true })
  image: Buffer;

  @Column({ name: 'DateFinEvenement', type: 'datetime', nullable: true }) 
  dateFin: Date;

  @Column({ name: 'ImageMimeType', type: 'varchar', length: 100, nullable: true })
  imageMimeType: string;

  @ManyToOne(() => User, (utilisateur) => utilisateur.publications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'IdUtilisateur' }) // Mettre la colonne de la clé étrangère
  utilisateur: User;

  @Column({ name: 'IdUtilisateur', type: 'int', nullable: false })
  utilisateurId: number;

  @Column({ name: 'id_ecole', type: 'int', nullable: false })
  idEcole: number;

  @Column({ name: 'ListeEcoleIds', type: 'int', nullable: false })
  listeEcoleIds: string;

  @OneToMany(() => PublicationCategories, pc => pc.publication)
  publicationCategories: PublicationCategories[];

  categories: any;

  @ManyToOne(() => School, (ecole) => ecole.publications, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_ecole' }) 
  ecole: School;

}
