import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../service/blog.service';
import { Article } from '../../../entity/article';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-article-show',
  templateUrl: './article-show.component.html',
  styleUrl: './article-show.component.scss'
})
export class ArticleShowComponent {
  article?: Article;
  routeSub: any;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private blogService: BlogService, private messageService: MessageService,) { }

  ngOnInit(): void {
    // Simuler un fetch par ID (dans une vraie app, ici appel à un service)
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadOneArticle(id);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['messageShown'] === 'true') {
        setTimeout(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Article',
            detail: 'L article a bien été créé.',
            life: 10000
          });
        }, 100);
      }
    });
  }

  // Récupérer les écoles
  loadOneArticle(idArticle: number): void {
    this.blogService.findOne(idArticle).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des écoles', err);
        this.isLoading = false;
      }
    });
  }
}