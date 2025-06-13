import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-article-update',
  template: `<app-article-form [nomEcole]="nomEcole" (submitForm)="onSubmit($event)" [article]="article" [isEditMode]="true"></app-article-form>`,
  styleUrls: ['./article-form/article-form.component.scss']
})
export class ArticleUpdateComponent implements OnInit {
  article: any = null;
  nomEcole: string = '';
  articleId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));

    this.blogService.findOne(this.articleId).subscribe(data => {
      this.article = {
        titre: data.titre,
        image: data.image,
        contenu: data.contenu,
        tagIds: data.tags?.map((tag: any) => tag.idTag) || []
      };
      this.nomEcole = data.ecole?.nom || '';
    });
  }

  onSubmit(updatedArticle: any): void {
    const dataToSend = {
      id: this.articleId,
      ...updatedArticle
    };

    this.blogService.updateArticle(dataToSend).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Article mis à jour', detail: 'La publication a bien été modifiée.' });
      this.router.navigate(['/article', this.articleId]);
    });
  }

}
