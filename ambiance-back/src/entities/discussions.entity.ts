import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Groupe } from './groups.entity';

@Entity('Discussions') // Correspond au nom de la table
export class Discussion {
  @PrimaryGeneratedColumn({ name: 'idDiscussion' })
  idDiscussion: number;

  @Column({ name: 'type_discussion', type: 'int' })
  typeDiscussion: number;

  @Column({ name: 'date_creation', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @ManyToOne(() => Groupe, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'IdGroupe' })
  idGroupe: Groupe;
}