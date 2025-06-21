// src/users/mappers/user.mapper.ts
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/users.entity';

export function toUserDto(user: User): UserDto {
  const {
    idUtilisateur,
    prenom,
    nom,
    pseudo,
    dateDeNaissance,
    genre,
    mail,
    role,
    telephone,
    pays,
    image,
    imageMimeType,
    doubleAuthent
  } = user;

  let imageBase64: string | null = null;
  if (image && imageMimeType) {
    const base64 = image.toString('base64');
    imageBase64 = `data:${imageMimeType};base64,${base64}`;
  }

  return {
    idUtilisateur,
    prenom,
    nom,
    pseudo,
    dateDeNaissance,
    genre,
    mail,
    role,
    telephone,
    pays,
    image: imageBase64,
    imageMimeType,
    doubleAuthent
  };
}
