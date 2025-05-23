import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Categorie, Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';
import { CategoriesService } from '../../service/categories.service';
import { EcoleService } from '../../service/ecole.service';
import { Ecole } from '../../entity/ecole';

@Component({
  selector: 'app-ecole',
  templateUrl: './ecole.component.html',
  styleUrls: ['./ecole.component.scss']
})
export class EcoleComponent implements OnInit{
  ecoles: Ecole[] = [];

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService,
    private ecoleService: EcoleService
  ) { }

  
  ngOnInit(): void {
    this.loadEcoles();
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
}
