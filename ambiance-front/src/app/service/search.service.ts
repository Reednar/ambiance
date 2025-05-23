import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { Publication } from '../entity/publications';
import { Ecole } from '../entity/ecole';
import { User } from '../entity/users';

export interface SearchEntry {
  type: 'publication' | 'user' | 'ecole';
  title: string;
  content: string;
  route: string;
  original: any;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private fuse: Fuse<SearchEntry> | null = null;
  private index: SearchEntry[] = [];

  // Appelle ceci au démarrage ou après avoir récupéré tes données (depuis des services ou APIs)
  initialize(publications: Publication[] | null, users: User[] | null, ecoles: Ecole[] | null) {
  this.index = [
    ...(publications || []).map(p => ({
      type: 'publication' as const,
      title: p.titre,
      content: `${p.description} ${p.ville} ${p.categories.map(c => c.nom).join(' ')}`,
      route: `/publication-show/${p.idPublication}`,
      original: p
    })),
    ...(users || []).map(u => ({
      type: 'user' as const,
      title: `${u.prenom} ${u.nom} (${u.pseudo})`,
      content: u.description,
      route: `/utilisateurs/${u.idUtilisateur}`,
      original: u
    })),
    ...(ecoles || []).map(e => ({
      type: 'ecole' as const,
      title: e.nom,
      content: `${e.ville} ${e.description}`,
      route: `/ecoles/${e.id}`,
      original: e
    }))
  ];

  this.fuse = new Fuse(this.index, {
    keys: ['title', 'content'],
    threshold: 0.3
  });
}



  search(term: string): SearchEntry[] {

    if (!this.fuse || !term) {
      return [];
    }

    const results = this.fuse.search(term).map(r => r.item);
    return results;
}

}
