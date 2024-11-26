import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity('Participation') // Correspond au nom de la table
  export class Participation {
    @PrimaryGeneratedColumn({ name: 'idParticipation' })
    idParticipation: number;
  
    @Column({ name: 'IdUtilisateur', type: 'int', nullable: false })
    idUtilisateur: number;
  
    @Column({ name: 'IdGroupe', type: 'int', nullable: false })
    idGroupe: number;
  
    @Column({ name: 'PaiementEffectue', type: 'boolean', default: false })
    paiementEffectue: boolean;
  
    @Column({ name: 'Facture', type: 'blob', nullable: true})
    facture: Buffer;
  
    @Column({
      name: 'Montant',
      type: 'decimal',
      precision: 15,
      scale: 2,
      nullable: false,
    })
    montant: number;
  
    @Column({ name: 'Organisateur', type: 'boolean', default: false })
    organisateur: boolean;
  }
  