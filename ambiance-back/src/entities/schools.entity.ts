import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './users.entity'; // Assurez-vous que le chemin est correct
import { MembresBDE } from './membresBDE.entity';

@Entity('Ecoles')
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nom: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  site_web: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  contact_email: string;

  @Column({ type: 'enum', enum: ['publique', 'privée', 'autre'], nullable: false })
  type_ecole: 'publique' | 'privée' | 'autre';

  @Column({ type: 'varchar', length: 255, nullable: false })
  rue: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  ville: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  code_postal: string;

  @ManyToOne(() => User, (user) => user.ecoles, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_createur' })
  createur: User;

  @OneToMany(() => MembresBDE, (membreBDE) => membreBDE.ecole)
  membresBDE: MembresBDE[];
}