import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { School } from './schools.entity';

@Entity('MembresBDE') // Correspond au nom de la table SQL
export class MembresBDE {
  @PrimaryColumn({ name: 'id_utilisateur', type: 'int' })
  idUtilisateur: number;

  @PrimaryColumn({ name: 'id_ecole', type: 'int' })
  idEcole: number;

  @Column({ type: 'enum', enum: ['pending', 'verified'], default: 'pending' })
  status: 'pending' | 'verified';

  @Column({ name: 'date_fin', type: 'date', nullable: true })
  dateFin: Date;

  @Column({ name: 'is_actif', type: 'boolean', default: true })
  isActif: boolean;

  @ManyToOne(() => User, (user) => user.membresBDE, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: User;

  @ManyToOne(() => School, (school) => school.membresBDE, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ecole' })
  ecole: School;
}