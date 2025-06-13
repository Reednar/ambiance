import { Component, OnInit } from '@angular/core';
import { Ecole } from '../../../core/models/ecole';
import { EcoleService } from '../../../core/services/ecole.service';
import { BlogService } from '../../../core/services/blog.service';
import { Article } from '../../../core/models/article';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  ecoles: Ecole[] = [];
  articles: Article[] = [];
  selectedSchools: Set<number> = new Set();

  constructor(
    private ecoleService: EcoleService,
    private blogService: BlogService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['ecole']) {
        this.selectedSchools.add(Number(params['ecole']));
      }

      this.loadEcoles();
      this.loadArticles();
    });
  }

  // Récupérer les écoles
  loadEcoles(): Promise<void> {
    return new Promise((resolve) => {
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
    return new Promise((resolve) => {
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
    if (this.selectedSchools.size === 0) {
      return this.articles;
    }
    const filtered = this.articles.filter(article =>
      article.idEcole !== undefined && this.selectedSchools.has(article.idEcole)
    );
    return filtered;
  }


  toggleSchoolFilter(schoolId: number): void {
    if (this.selectedSchools.has(schoolId)) {
      this.selectedSchools.delete(schoolId);
    } else {
      this.selectedSchools.add(schoolId);
    }
  }

}