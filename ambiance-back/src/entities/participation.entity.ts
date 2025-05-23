import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { Groupe } from './groups.entity';
import { Paiement } from './paiements.entity';

@Entity('Participation') // Correspond au nom de la table
export class Participation {
  @PrimaryGeneratedColumn({ name: 'idParticipation' })
  idParticipation: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'IdUtilisateur' })
  idUtilisateur: User;

  @ManyToOne(() => Groupe, { nullable: false })
  @JoinColumn({ name: 'IdGroupe' })
  idGroupe: Groupe;

  @Column({ name: 'PaiementEffectue', type: 'boolean', default: false })
  paiementEffectue: boolean;

  @ManyToOne(() => Paiement, { nullable: true })
  @JoinColumn({ name: 'IdPaiement' })
  idPaiement: Paiement;
}
