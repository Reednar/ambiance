import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('Paiements') // Correspond au nom de la table
export class Paiement {
  @PrimaryGeneratedColumn({ name: 'idPaiement' })
  idPaiement: number;

  @Column({ name: 'montant', type: 'decimal', precision: 15, scale: 2 })
  montant: number;

  @Column({ name: 'date_paiement', type: 'datetime' })
  datePaiement: Date;

  @Column({ name: 'justificatif', type: 'longtext' })
  justificatif: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'IdUtilisateur' })
  idUtilisateur: User;
}