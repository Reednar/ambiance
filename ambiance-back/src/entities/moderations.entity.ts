import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { Groupe } from './groups.entity';

@Entity('Moderations') // Correspond au nom de la table
export class Moderations {
  @PrimaryGeneratedColumn({ name: 'idModeration' })
  idModeration: number;

  @Column({ name: 'type_action', type: 'varchar', length: 50 })
  typeAction: string;

  @Column({ name: 'date_action', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dateAction: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'IdUtilisateur' })
  idUtilisateur: User;

  @ManyToOne(() => Groupe, { nullable: false })
  @JoinColumn({ name: 'IdGroupe' })
  idGroupe: Groupe;
}