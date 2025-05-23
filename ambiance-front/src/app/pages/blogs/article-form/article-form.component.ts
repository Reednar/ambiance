import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlogService } from '../../../service/blog.service';
import { EcoleService } from '../../../service/ecole.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit, OnChanges {
  @Input() nomEcole: string = '';
  @Input() isEditMode: boolean = false;
  @Input() article: any = {
    titre: '',
    image: '',
    contenu: '',
    ecoleId: null,
    tagIds: []
  };
  @Output() submitForm = new EventEmitter<any>();

  tags: { id: number; nom: string }[] = [];
  selectedTags: { id: number, nom: string }[] = [];

  constructor(private blogService: BlogService, private schoolService: EcoleService) {}

  ngOnInit() {
    this.blogService.getAllTags().subscribe(data => {
      this.tags = data;
      this.updateSelectedTags(); // dans le cas où les tags sont déjà là
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article'] && this.tags.length) {
      this.updateSelectedTags(); // au cas où article change après les tags
    }
  }

  updateSelectedTags() {
    if (this.article?.tagIds) {
      this.selectedTags = this.tags.filter(tag => this.article.tagIds.includes(tag.id));
    }
  }

  toggleTagSelection(tag: { id: number, nom: string }, event: Event) {
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      const tagIds = this.selectedTags.map(t => t.id);
      const articleData = {
        ...this.article,
        tagIds: tagIds
      };
      this.submitForm.emit(articleData);
    }
  }
}
