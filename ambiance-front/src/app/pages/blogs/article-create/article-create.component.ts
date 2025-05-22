import { Component } from '@angular/core';
import { BlogService } from '../../../service/blog.service';
import { Ecole } from '../../../entity/ecole';
import { EcoleService } from '../../../service/ecole.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrl: './article-create.component.scss'
})
export class ArticleCreateComponent {
article = {
  titre: '',
  image: '',
  contenu: '',
  ecoleId: null,
  tagIds: []
};

constructor(private blogService: BlogService, private schoolService: EcoleService, private router: Router, private messageService: MessageService,){}
ecole ?: Ecole;
tags: { id: number; nom: string }[] = [];
selectedTagIds: number[] = [];
selectedTags: { id: number, nom: string }[] = [];
nomEcole: string = "";

ngOnInit() {
  //this.userId = sessionStorage.getItem('id_utilisateur') ?? '';

  //this.ecoleService.findAll().subscribe(data => this.ecoles = data);
  this.blogService.getAllTags().subscribe(data => this.tags = data);
  this.schoolService.findSchoolByUserId(Number(sessionStorage.getItem('id_utilisateur')) || 0).subscribe(data => this.ecole = data);
  this.schoolService.findSchoolByUserId(Number(sessionStorage.getItem('id_utilisateur')) || 0).subscribe(data => this.nomEcole = data.nom);
}

onSubmit() {
  const idAuteur = Number(sessionStorage.getItem('id_utilisateur'));
  const tagIds = this.selectedTags.map(tag => tag.id);

  const articleData = {
    titre: this.article.titre,
    contenu: this.article.contenu,
    image: this.article.image,
    idAuteur: idAuteur,
    id_ecole: this?.ecole?.id ?? 0,
    tagIds: tagIds
  };

  this.blogService.createArticle(articleData).subscribe(response => {
    const articleId = response.idArticle;
        this.messageService.add({ severity: 'success', summary: 'Publication créée', detail: 'La publication a bien été créée.' });

    this.router.navigate(['/article', articleId]);
  });
}



toggleTagSelection(tag: { id: number, nom: string }, event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    this.selectedTags.push(tag);
  } else {
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
  }
}

isSelected(tag: { id: number, nom: string }): boolean {
  return this.selectedTags.some(t => t.id === tag.id);
}

getSelectedTagsLabel(): string {
  return this.selectedTags.length
    ? this.selectedTags.map(t => t.nom).join(', ')
    : 'Sélectionner des tags';
}

}
