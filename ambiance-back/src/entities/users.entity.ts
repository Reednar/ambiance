import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { School } from './schools.entity';
import { Publication } from './publications.entity';
import { MembresBDE } from './membresBDE.entity';
import { Article } from './articles.entity';

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

  @Column({
    name: 'Role',
    type: 'enum',
    enum: ['Utilisateur', 'Administrateur'],
    nullable: false,
  })
  role: 'Utilisateur' | 'Administrateur';

  @Column({ name: 'Telephone', type: 'varchar', length: 50, nullable: true })
  telephone: string;

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

  @OneToMany(() => Article, article => article.utilisateur)
  articles: Article[];
}
