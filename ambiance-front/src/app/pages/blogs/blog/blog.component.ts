import { Component, OnInit } from '@angular/core';

interface Blog {
  id: number;
  titre: string;
  contenu: string;
  date: string;
  image: string;
  ecole: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{

blogs: Blog[] = [];

  ngOnInit(): void {
    this.blogs = [
      {
        id: 1,
        titre: 'Ensitech : une pédagogie innovante',
        contenu: 'Découvrez comment Ensitech forme les développeurs de demain en alternance.',
        date: '2025-05-20',
        image: 'assets/dev.jpg',
        ecole: 'Ensitech'
      },
      {
        id: 2,
        titre: 'La Sorbonne : excellence académique',
        contenu: 'Un regard sur les programmes interdisciplinaires de la Sorbonne Université.',
        date: '2025-05-19',
        image: 'assets/sorb.jpg',
        ecole: 'Sorbonne Université'
      },
      {
        id: 3,
        titre: 'Paris-Saclay : moteur scientifique',
        contenu: 'Retour sur les dernières innovations et partenariats de Paris-Saclay.',
        date: '2025-05-18',
        image: 'assets/mot.jpg',
        ecole: 'Université Paris-Saclay'
      }
    ];
  }

}