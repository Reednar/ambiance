import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './users.entity'; // Chemin à ajuster selon votre projet
  
  @Entity('Documents') // Correspond au nom de la table
  export class Document {
    @PrimaryGeneratedColumn({ name: 'IdDocument' })
    idDocument: number;
  
    @Column({ name: 'Cni', type: 'blob', nullable: false })
    cni: Buffer;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        nullable: false,
      })
      @JoinColumn({ name: 'IdUtilisateur' }) // Associe la colonne étrangère IdUtilisateur
      utilisateur: User;
  
}
  