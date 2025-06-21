import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/users.entity'; // Update this line
import { toUserDto } from 'src/controllers/users/mappers.users';
import { UpdateUserDto, UserDto } from 'src/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { Groupe } from 'src/entities/groups.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Groupe)
    private readonly groupeRepository: Repository<Groupe>, // Assurez-vous d'importer l'entité Groupe
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return users.map(toUserDto);
  }

  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy({ idUtilisateur: id });
    return user ? toUserDto(user) : null;
  }

  async findOneByMail(mail: string): Promise<User> {
    return await this.userRepository.findOneBy({ mail: mail });
  }

  async create(User: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(User);
    return await this.userRepository.save(newUser);
  }

  // async update(id: number, updateData: Partial<User>): Promise<User> {
  //   await this.userRepository.update(id, updateData);
  //   return this.findOne(id);
  // }

  async update(id: number, updateDto: UpdateUserDto): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy({ idUtilisateur: id });
    if (!user) {
      return null;
    }

    if (updateDto.motDePasse) {
      // Si motDePasse est fourni, on le hash AVANT de sauvegarder
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      user.motDePasse = await bcrypt.hash(updateDto.motDePasse, salt);
    } else {
      // Sinon on garde l'ancien mot de passe
      user.motDePasse = user.motDePasse;
    }

    // Traitement spécial pour l'image
    if (updateDto.image && updateDto.imageMimeType) {
      // Pas besoin de faire split(',') car image ici est juste base64, pas dataURI
      user.image = Buffer.from(updateDto.image, 'base64');
      user.imageMimeType = updateDto.imageMimeType;
    }
    console.log(updateDto.doubleAuthent);

    // Mise à jour des autres champs
    Object.assign(user, {
      prenom: updateDto.prenom ?? user.prenom,
      nom: updateDto.nom ?? user.nom,
      pseudo: updateDto.pseudo ?? user.pseudo,
      dateDeNaissance: updateDto.dateDeNaissance ?? user.dateDeNaissance,
      genre: updateDto.genre ?? user.genre,
      mail: updateDto.mail ?? user.mail,
      telephone: updateDto.telephone ?? user.telephone,
      pays: updateDto.pays ?? user.pays,
      emailConfirmed: updateDto.emailConfirmed ?? user.emailConfirmed,
      confirmationToken:
        updateDto.emailConfirmed === true
          ? null
          : (updateDto.confirmationToken ?? user.confirmationToken),
      confirmationTokenExpires:
        updateDto.emailConfirmed === true
          ? null
          : (updateDto.confirmationTokenExpires ??
            user.confirmationTokenExpires),
      role: updateDto.role ?? user.role,
      doubleAuthent:
        updateDto.doubleAuthent !== undefined
          ? (updateDto.doubleAuthent as any) === true ||
            (updateDto.doubleAuthent as any) === 'true'
          : user.doubleAuthent,
    });
    const updatedUser = await this.userRepository.save(user);
    return toUserDto(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ idUtilisateur: id });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.userRepository.delete(id);
  }

  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user.role === 'Administrateur'; // Assurez-vous que le champ `role` correspond aux valeurs définies dans l'entité User
  }

  async findUsersBySchool(idEcole: number): Promise<User[]> {
    return await this.userRepository.find({
      where: { ecole: { id: idEcole } },
      relations: ['ecole'], // Charger la relation avec l'école
    });
  }

  async findEntityById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { idUtilisateur: id },
      relations: ['ecole', 'publications', 'membresBDE', 'articles'], // selon besoins
    });
  }

  async findByConfirmationToken(token: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { confirmationToken: token },
    });
  }

  async updateConfirmationToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      confirmationToken: token,
      confirmationTokenExpires: expiresAt,
    });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
