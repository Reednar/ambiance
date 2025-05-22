import { Component, OnInit } from '@angular/core';
import { Ecole } from '../../../entity/ecole';
import { EcoleService } from '../../../service/ecole.service';
import { BlogService } from '../../../service/blog.service';
import { Article } from '../../../entity/article';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{
  ecoles: Ecole[] = [];
  articles: Article[] = [];
  selectedSchools: Set<number> = new Set();

  constructor(
    private ecoleService: EcoleService,
    private blogService: BlogService
  ){}

  ngOnInit(): void {
    this.loadEcoles();
    this.loadArticles();
  }

  // Récupérer les écoles
loadEcoles(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.ecoleService.findAllSchools().subscribe({
      next: (data) => {
        this.ecoles = data;
        resolve();  // Résoudre la Promise une fois les données récupérées
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des écoles', err);
       resolve();  // Rejeter la Promise en cas d'erreur
      }
    });
  });
}

  // Récupérer les écoles
loadArticles(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.blogService.list().subscribe({
      next: (data) => {
        this.articles = data;
        resolve();  // Résoudre la Promise une fois les données récupérées
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des écoles', err);
       resolve();  // Rejeter la Promise en cas d'erreur
      }
    });
  });
}

 // Pour récupérer la liste des écoles sélectionnées (objet complet, pas seulement id)
  getSelectedSchools() {
    return this.ecoles.filter(school => this.selectedSchools.has(school.id));
  }

filteredArticles(): Article[] {
  console.log('Filtrage des articles avec écoles sélectionnées:', Array.from(this.selectedSchools));
  if (this.selectedSchools.size === 0) {
    console.log('Aucune école sélectionnée, affichage de tous les articles');
    return this.articles;
  }
  const filtered = this.articles.filter(article => 
    article.idEcole !== undefined && this.selectedSchools.has(article.idEcole)
  );
  console.log(`Articles filtrés (${filtered.length}):`, filtered.map(a => a.titre));
  return filtered;
}


  toggleSchoolFilter(schoolId: number): void {
  if (this.selectedSchools.has(schoolId)) {
    this.selectedSchools.delete(schoolId);
    console.log(`École décochée : ${schoolId}`);
  } else {
    this.selectedSchools.add(schoolId);
    console.log(`École cochée : ${schoolId}`);
  }
  console.log('Écoles sélectionnées:', Array.from(this.selectedSchools));
}

}