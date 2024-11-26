import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './posts.entity';

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

  @Column({ name: 'Telephone', type: 'varchar', length: 50, nullable: false })
  telephone: string;

  @Column({ name: 'Rib', type: 'varchar', length: 34, nullable: false })
  rib: string;

  // Relation avec les publications
  @OneToMany(() => Post, (publication) => publication.utilisateur)
  posts: Post[];
}
