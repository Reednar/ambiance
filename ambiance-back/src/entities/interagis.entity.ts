import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity('Interagis') // Correspond au nom de la table
  export class Interagis {
    @PrimaryGeneratedColumn({ name: 'idInteragis' })
    idInteragis: number;
  
    @Column({ name: 'IdUtilisateur', type: 'int', nullable: false })
    idUtilisateur: number;
  
    @Column({ name: 'IdPublication', type: 'int', nullable: false })
    idPublication: number;
  
    @Column({ name: 'Aime', type: 'boolean', default: false })
    aime: boolean;
  
    @Column({ name: 'Deteste', type: 'boolean', default: false })
    deteste: boolean;
  
    @Column({ name: 'Present', type: 'boolean', default: false })
    present: boolean;
  }
  