// article-create.component.ts
import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { Ecole } from '../../core/models/ecole';
import { EcoleService } from '../../core/services/ecole.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-article-create',
  template: `<app-article-form [nomEcole]="nomEcole" (submitForm)="onSubmit($event)"></app-article-form>`,
  // styleUrls: ['/article-form/article-form.component.scss']
})
export class ArticleCreateComponent implements OnInit {
  nomEcole = '';
  ecole?: Ecole;

  constructor(
    private blogService: BlogService,
    private schoolService: EcoleService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    const userId = Number(sessionStorage.getItem('id_utilisateur')) || 0;
    this.schoolService.findSchoolByUserId(userId).subscribe(data => {
      this.ecole = data;
      this.nomEcole = data.nom;
    });
  }

  onSubmit(articleData: any) {
    const idAuteur = Number(sessionStorage.getItem('id_utilisateur'));
    const dataToSend = {
      ...articleData,
      idAuteur: idAuteur,
      id_ecole: this.ecole?.id ?? 0,
    };

    this.blogService.createArticle(dataToSend).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Publication créée', detail: 'La publication a bien été créée.' });
      this.router.navigate(['/article', response.idArticle]);
    });
  }
}
