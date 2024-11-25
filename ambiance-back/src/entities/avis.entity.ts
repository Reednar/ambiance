import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity('Avis') // Correspond au nom de la table
  export class Avis {
    @PrimaryGeneratedColumn({ name: 'IdAvis' })
    idAvis: number;
  
    @Column({ name: 'IdUtilisateur', type: 'int', nullable: false })
    idUtilisateur: number;
  
    @Column({ name: 'IdUtilisateur_1', type: 'int', nullable: false })
    idUtilisateur1: number;
  
    @Column({ name: 'Note', type: 'smallint', nullable: false })
    note: number;
  
    @Column({ name: 'Avis', type: 'text',  nullable: true })
    avis: string;
  }