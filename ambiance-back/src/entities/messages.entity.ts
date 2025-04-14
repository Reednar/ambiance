import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { Discussion } from './discussions.entity';

@Entity('Messages')
export class Message {
  @PrimaryGeneratedColumn({ name: 'idMessage' })
  idMessage: number;

  @Column({ name: 'contenu', type: 'text' })
  contenu: string;

  @Column({ name: 'date_envoi', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dateEnvoi: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUtilisateur' })
  idUtilisateur: User;

  @ManyToOne(() => Discussion, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idDiscussion' })
  idDiscussion: Discussion;
}