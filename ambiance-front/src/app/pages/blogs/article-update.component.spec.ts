import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ArticleUpdateComponent } from './article-update.component';
import { BlogService } from '../../service/blog.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

describe('ArticleUpdateComponent', () => {
  let component: ArticleUpdateComponent;
  let fixture: ComponentFixture<ArticleUpdateComponent>;
  const fakeMessageService = {
    add: () => {}
  };
  // Fake minimal pour service BlogService
  const fakeArticle = {
    id: 123,
    titre: 'Titre test',
    image: 'image.jpg',
    contenu: 'Contenu test',
    tags: [{ idTag: 1 }],
    ecole: { nom: 'Ecole test' }
  };

  const fakeBlogService = {
    findOne: () => of(fakeArticle),
    updateArticle: (article: any) => of(article)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleUpdateComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: BlogService, useValue: fakeBlogService },
        { provide: MessageService, useValue: fakeMessageService },

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123'  // retourne l'id en string
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit()
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger l\'article au démarrage', () => {
    expect(component.article.titre).toBe('Titre test');
    expect(component.nomEcole).toBe('Ecole test');
    expect(component.articleId).toBe(123);
  });
});
