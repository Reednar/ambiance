import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Publication } from './publications.entity';
import { Participation } from './participation.entity';
import { User } from './users.entity';

@Entity('Groupes') 
export class Groupe {
  @PrimaryGeneratedColumn({ name: 'IdGroupe' })
  idGroupe: number;

  @Column({ name: 'NomDuGroupe', type: 'varchar', length: 50, nullable: false })
  nomDuGroupe: string;


  @ManyToOne(() => Publication, (publication) => publication, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'IdPublication' })
  publication: Publication;

  @Column({ name: 'date_creation', type: 'datetime', nullable: true })
  dateCreation: Date;

  @ManyToOne(() => User, (user) => user.idUtilisateur, { nullable: false })
  @JoinColumn({ name: 'IdUtilisateur' })
  utilisateur: User;

  @OneToMany(() => Participation, (participation) => participation.idGroupe)
  participations: Participation[];
}