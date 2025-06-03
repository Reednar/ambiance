// test-data.ts
import { ParamMap } from '@angular/router';
import { Ecole } from '../../entity/ecole';
import { Article } from '../../entity/article';

export const fakeParamMap: ParamMap = {
  get: () => '123',
  getAll: () => ['123'],
  has: () => true,
  keys: ['id']
};

export const fakeEcole: Ecole = {
  id: 1,
  nom: 'Ecole test',
  siteWeb: 'https://ecoletest.com',
  telephone: '0123456789',
  description: 'Description test',
  typeEcole: 'Type test',
  contactEail: 'contact@ecoletest.com',
  idCreateur: 'creatorId',
  codePostal: '75000',
  rue: '1 rue de Test',
  ville: 'Paris',
  dateCreation: new Date(),
  allowedDomain: 'ecoletest.com',
  image: 'image.jpg'
};

export const fakeArticle: Article = {
  id: 123,
  titre: 'Titre test',
  image: 'image.jpg',
  contenu: 'Contenu test',
  tags: [
    { idTag: 1, nom: 'Tag1' },
    { idTag: 2, nom: 'Tag2' }
  ],
  ecole: fakeEcole,
  dateCreation: new Date(),
  nomEcole: fakeEcole.nom
};
