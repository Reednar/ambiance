import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Categorie, Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';
import { CategoriesService } from '../../service/categories.service';

@Component({
  selector: 'app-ecole',
  templateUrl: './ecole.component.html',
  styleUrls: ['./ecole.component.scss']
})
export class EcoleComponent {
  schools = [
      {
        name: 'École Polytechnique',
        description: 'Grande école d\'ingénieurs située en France, renommée pour son excellence académique.',
        city: 'Palaiseau',
        image: 'assets/ensitech.jpg'
      },
      {
        name: 'HEC Paris',
        description: 'École de commerce prestigieuse, spécialisée en management et stratégie.',
        city: 'Jouy-en-Josas',
        image: 'assets/ensitech.jpg'
      },
      {
        name: 'ENSA Lyon',
        description: 'École d\'architecture reconnue pour sa créativité et ses projets novateurs.',
        city: 'Lyon',
        image: 'assets/image_7.jpg'
      }
    ];
    
  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService
  ) { }

  
}
