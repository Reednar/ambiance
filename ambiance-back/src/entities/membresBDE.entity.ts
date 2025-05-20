import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { School } from './schools.entity';

@Entity('Membres_BDE') // Nouveau nom de la table
export class MembresBDE {
  @PrimaryColumn({ name: 'Id_utilisateur', type: 'int' })
  idUtilisateur: number;

  @PrimaryColumn({ name: 'Id_ecole', type: 'int' })
  idEcole: number;

  @Column({ name: 'Status', type: 'enum', enum: ['pending', 'verified'], default: 'pending' })
  status: 'pending' | 'verified';

  @Column({ name: 'Date_fin', type: 'date', nullable: true })
  dateFin: Date;

  @Column({ name: 'Is_actif', type: 'boolean', default: true })
  isActif: boolean;

  @ManyToOne(() => User, (user) => user.membresBDE, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Id_utilisateur' })
  utilisateur: User;

  @ManyToOne(() => School, (school) => school.membresBDE, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Id_ecole' })
  ecole: School;
}