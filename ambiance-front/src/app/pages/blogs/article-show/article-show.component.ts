import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
  schoolName: string;
}
@Component({
  selector: 'app-article-show',
  templateUrl: './article-show.component.html',
  styleUrl: './article-show.component.scss'
})
export class ArticleShowComponent {
 article: BlogArticle | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Simuler un fetch par ID (dans une vraie app, ici appel à un service)
    const id = this.route.snapshot.paramMap.get('id');
    const allArticles: BlogArticle[] = [
      {
        id: 1,
        title: 'La pédagogie d’Ensitech',
        content: 'Ensitech propose une pédagogie innovante centrée sur l’alternance et la pratique. Ses étudiants bénéficient d’un accompagnement personnalisé...',
        date: '2025-05-20',
        image: 'assets/dev.jpg',
        schoolName: 'Ensitech'
      },
      {
        id: 2,
        title: 'Les laboratoires de Paris-Saclay',
        content: 'L’université Paris-Saclay se distingue par ses laboratoires de recherche de renommée mondiale, notamment dans les domaines des sciences...',
        date: '2025-05-21',
        image: 'assets/sorb.jpg',
        schoolName: 'Université Paris-Saclay'
      }
    ];

    this.article = allArticles.find(a => a.id.toString() === id) || null;
  }
}