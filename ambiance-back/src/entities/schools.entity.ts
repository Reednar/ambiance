import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './users.entity';
import { MembresBDE } from './membresBDE.entity';
import { Publication } from './publications.entity';
import { Article } from './articles.entity';

@Entity('Ecoles')
export class School {
  @PrimaryGeneratedColumn({ name: 'Id_ecole' })
  id: number;

  @Column({ name: 'Nom', type: 'varchar', length: 255, nullable: false })
  nom: string;

  @Column({ name: 'Site_web', type: 'varchar', length: 255, nullable: true })
  site_web: string;

  @Column({ name: 'Telephone', type: 'varchar', length: 20, nullable: true })
  telephone: string;

  @Column({ name: 'Description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'Contact_email', type: 'varchar', length: 255, nullable: false })
  contact_email: string;

  @Column({ name: 'Type_ecole', type: 'enum', enum: ['publique', 'privée', 'autre'], nullable: false })
  type_ecole: 'publique' | 'privée' | 'autre';

  @Column({ name: 'Rue', type: 'varchar', length: 255, nullable: false })
  rue: string;

  @Column({ name: 'Ville', type: 'varchar', length: 100, nullable: false })
  ville: string;

  @Column({ name: 'Code_postal', type: 'varchar', length: 20, nullable: false })
  code_postal: string;

  @ManyToOne(() => User, (user) => user.ecole, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Id_createur' })
  createur: User;

  @OneToMany(() => MembresBDE, (membreBDE) => membreBDE.ecole)
  membresBDE: MembresBDE[];

  @OneToMany(() => Publication, (publication) => publication.ecole)
  publications: Publication[];

  @Column({ name: 'Date_creation', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @Column({ name: 'Allowed_domain', type: 'text', nullable: true })
  allowed_domain: string;

  @Column({ name: 'Image', type: 'text', nullable: true })
  image: string;

  @OneToMany(() => Article, article => article.ecole)
  articles: Article[];
}