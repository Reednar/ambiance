import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { School } from './schools.entity';
import { Publication } from './publications.entity';
import { MembresBDE } from './membresBDE.entity';
import { Article } from './articles.entity';
import { Groupe } from './groups.entity';

@Entity('Utilisateurs')
export class User {
  @PrimaryGeneratedColumn({ name: 'IdUtilisateur' })
  idUtilisateur: number;

  @Column({ name: 'Prenom', type: 'varchar', length: 50, nullable: false })
  prenom: string;

  @Column({ name: 'Nom', type: 'varchar', length: 50, nullable: false })
  nom: string;

  @Column({ name: 'Pseudo', type: 'varchar', length: 50, nullable: false })
  pseudo: string;

  @Column({ name: 'DateDeNaissance', type: 'date', nullable: false })
  dateDeNaissance: Date;

  @Column({
    name: 'Genre',
    type: 'enum',
    enum: ['Homme', 'Femme', 'Autre'],
    nullable: false,
  })
  genre: 'Homme' | 'Femme' | 'Autre';

  @Column({ name: 'Mail', type: 'varchar', length: 100, nullable: false })
  mail: string;

  @Column({ name: 'MotDePasse', type: 'varchar', length: 155, nullable: false })
  motDePasse: string;

  @Column({ name: 'Pays', type: 'varchar', length: 50, nullable: false })
  pays: string;

  @Column({ name: 'id_ecole', type: 'int', nullable: false })
  idEcole: number;

  @Column({ name: 'double_authent', type: 'boolean', nullable: true })
  doubleAuthent: boolean;

  @Column({ name: 'code_double_authent', type: 'varchar', nullable: true })
  codeDoubleAuthent: string;

  @Column({
    name: 'date_code_double_authent',
    type: 'datetime',
    nullable: true,
  })
  dateCodeDoubleAuthent: Date;

  @Column({
    name: 'Role',
    type: 'enum',
    enum: ['Utilisateur', 'Administrateur'],
    nullable: false,
  })
  role: 'Utilisateur' | 'Administrateur';

  @Column({ name: 'Telephone', type: 'varchar', length: 50, nullable: true })
  telephone: string;

  @Column({ name: 'Image', type: 'longblob', nullable: true })
  image: Buffer;

  @Column({
    name: 'ImageMimeType',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  imageMimeType: string;

  @Column({
    name: 'ConfirmationToken',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  confirmationToken?: string;

  @Column({
    name: 'ConfirmationTokenExpires',
    type: 'datetime',
    nullable: true,
  })
  confirmationTokenExpires?: Date;

  @Column({ name: 'EmailConfirmed', type: 'boolean', default: false })
  emailConfirmed: boolean;

  // Relation avec les écoles (un utilisateur peut être rattaché à une école)
  @ManyToOne(() => School, (school) => school.id, { nullable: true })
  @JoinColumn({ name: 'id_ecole' })
  ecole: School;

  // Relation avec les publications
  @OneToMany(() => Publication, (publication) => publication.utilisateur)
  publications: Publication[];

  // Relation avec MembresBDE
  @OneToMany(() => MembresBDE, (membreBDE) => membreBDE.utilisateur)
  membresBDE: MembresBDE[];

  @OneToMany(() => Article, (article) => article.utilisateur)
  articles: Article[];

  @OneToMany(() => Groupe, (group) => group.utilisateur)
  groups: Groupe[];
}
