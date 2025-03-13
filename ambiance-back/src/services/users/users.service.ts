import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/users.entity'; // Update this line

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ idUtilisateur: id });
  }
  async findOneByMail(mail: string): Promise<User> {
    return await this.userRepository.findOneBy({ mail: mail });
  }

  async create(User: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(User);
    return await this.userRepository.save(newUser);
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
