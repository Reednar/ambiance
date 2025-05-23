import { Component, OnInit } from '@angular/core';
import { Article } from '../../../entity/article';
import { BlogService } from '../../../service/blog.service';

@Component({
  selector: 'app-article-created',
  templateUrl: './article-created.component.html',
  // styleUrls: ['./article-form/article-form.component.scss']
})
export class ArticleCreatedComponent implements OnInit {
  paginatedArticles: Article[] = [];
  userId: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  articles: Article[] = [];
  constructor(
      private blogService: BlogService
    ) { }

    ngOnInit(): void {
    this.userId = sessionStorage.getItem('id_utilisateur') ?? '';
    this.loadArticles();
  }

    loadArticles(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.blogService.findAllByAuthor(Number(sessionStorage.getItem('id_utilisateur')) || 0).subscribe({
      next: (data) => {
        this.articles = data;
        this.updatePageData()
        resolve();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des écoles', err);
       resolve();  // Rejeter la Promise en cas d'erreur
      }
    });
  });
}

updatePageData(): void {
  this.totalPages = Math.ceil(this.articles.length / this.pageSize); // <-- à ajouter
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedArticles = this.articles.slice(startIndex, endIndex);
}


  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageData();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageData();
    }
  }

  // deleteArticle(id: number): void {
  // if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
  //   this.blogService.delete(id).subscribe({
  //     next: () => {
  //       this.articles = this.articles.filter(article => article.idArticle !== id);
  //       this.updatePageData();
  //     },
  //     error: err => {
  //       console.error('Erreur lors de la suppression de l’article', err);
  //     }
  //   });
  // }

  deleteArticle(id: number): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    // Appel au service pour supprimer l'article
    this.blogService.delete(id).subscribe({
      next: () => {
        // Rafraîchir la liste après suppression
        this.loadArticles();
      },
      error: err => console.error('Erreur lors de la suppression', err)
    });
  }
}

}