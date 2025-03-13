import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Publication } from './publications.entity';

@Entity('Groupes') 
export class Groupe {
  @PrimaryGeneratedColumn({ name: 'IdGroupe' })
  idGroupe: number;

  @Column({ name: 'NomDuGroupe', type: 'varchar', length: 50, nullable: false })
  nomDuGroupe: string;

  @Column({ name: 'NombrePersonne', type: 'smallint', nullable: true })
  nombrePersonne: number;

  @ManyToOne(() => Publication, (publication) => publication, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'IdPublication' })
  publication: Publication;
}
