import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';  // Librairie de recherche floue
import { Publication } from '../models/publications';
import { Ecole } from '../models/ecole';
import { User } from '../models/users';

// Interface définissant une entrée pour la recherche
export interface SearchEntry {
  type: 'publication' | 'user' | 'ecole';  // Type d'entrée
  title: string;                          // Titre à afficher
  content: string;                        // Contenu textuel pour la recherche
  route: string;                         // URL de redirection
  original: any;                         // Objet original complet (Publication, User ou Ecole)
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private fuse: Fuse<SearchEntry> | null = null;  // Instance Fuse.js pour la recherche floue
  private index: SearchEntry[] = [];              // Index regroupant toutes les entrées recherchables

  /**
   * Initialise l'index de recherche à partir des données fournies
   * @param publications Liste des publications à indexer
   * @param users Liste des utilisateurs à indexer
   * @param ecoles Liste des écoles à indexer
   */
  initialize(publications: Publication[] | null, users: User[] | null, ecoles: Ecole[] | null) {
    // Création de l'index en combinant les données des trois types
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
        content: u.nom,
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

    // Création d'une instance Fuse.js avec les clés sur lesquelles faire la recherche et un seuil de tolérance
    this.fuse = new Fuse(this.index, {
      keys: ['title', 'content'],  // Recherche dans le titre et le contenu
      threshold: 0.3               // Tolérance à l'erreur (plus petit = recherche plus stricte)
    });
  }

  /**
   * Recherche dans l'index à partir d'un terme
   * @param term Terme à rechercher
   * @returns Liste des entrées correspondantes (SearchEntry[])
   */
  search(term: string): SearchEntry[] {
    if (!this.fuse || !term) {
      // Pas d'index initialisé ou terme vide -> retourne un tableau vide
      return [];
    }

    // Lance la recherche avec Fuse.js et retourne uniquement les éléments trouvés
    const results = this.fuse.search(term).map(r => r.item);
    return results;
  }
}
