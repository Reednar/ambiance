import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembresBDE } from '../../entities/membresBDE.entity';

@Injectable()
export class MembresBDEService {
  constructor(
    @InjectRepository(MembresBDE)
    private readonly membresBDERepository: Repository<MembresBDE>,
  ) {}

  async addMember(data: { idUtilisateur: number; idEcole: number; email: string; status: 'pending' | 'verified' }): Promise<void> {
    const membre = this.membresBDERepository.create(data);
    await this.membresBDERepository.save(membre);
  }

  async findPendingMembersBySchool(idEcole: number): Promise<MembresBDE[]> {
    return await this.membresBDERepository.find({
      where: { idEcole, status: 'pending' },
      relations: ['utilisateur'], // Inclure les informations sur l'utilisateur
    });
  }

  async findMemberBySchoolAndUser(idEcole: number, idUtilisateur: number): Promise<MembresBDE | null> {
    return await this.membresBDERepository.findOne({
      where: { idEcole, idUtilisateur },
    });
  }

  async findMembersBySchool(idEcole: number): Promise<MembresBDE[]> {
    return await this.membresBDERepository.find({
      where: { idEcole },
      relations: ['utilisateur'], // Charger les informations sur les utilisateurs
    });
  }

  async updateMemberStatus(idEcole: number, idUtilisateur: number, status: 'pending' | 'verified'): Promise<void> {
    await this.membresBDERepository.update({ idEcole, idUtilisateur }, { status });
  }

  async removeMember(idEcole: number, idUtilisateur: number): Promise<void> {
    await this.membresBDERepository.delete({ idEcole, idUtilisateur });
  }

  
}