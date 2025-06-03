import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ArticleShowComponent } from './article-show.component';
import { BlogService } from '../../../service/blog.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { Article } from '../../../entity/article';

describe('ArticleShowComponent', () => {
  let component: ArticleShowComponent;
  let fixture: ComponentFixture<ArticleShowComponent>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let paramMapSubject: Subject<ParamMap>;
  let queryParamsSubject: Subject<any>;

  beforeEach(async () => {
    // Crée des subjects pour simuler les Observables paramMap et queryParams
    paramMapSubject = new Subject<ParamMap>();
    queryParamsSubject = new Subject<any>();

    // Spy des services
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['findOne']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [ArticleShowComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
            queryParams: queryParamsSubject.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleShowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to paramMap and call loadOneArticle with the id', () => {
    const articleMock: Article = {
      id: 1,
      titre: 'Mon super article',
      contenu: 'Ceci est le contenu de l’article',
      dateCreation: new Date(),  // Date valide
      nomEcole: 'École Exemple',
      // propriétés optionnelles que tu peux aussi ajouter si besoin
      idArticle: 1,
      idAuteur: 123,
      tags: [
        { idTag: 1, nom: 'Tag1' },
        { idTag: 2, nom: 'Tag2' }
      ],
      image: 'image.png',
      idEcole: 10
    };

    blogServiceSpy.findOne.and.returnValue(of(articleMock));

    fixture.detectChanges(); // ngOnInit appelé

    paramMapSubject.next(convertToParamMap({ id: '1' }));

    expect(blogServiceSpy.findOne).toHaveBeenCalledWith(1);
    expect(component.article).toEqual(articleMock);
    expect(component.isLoading).toBeFalse();
  });

  it('should not call loadOneArticle if id is not present or invalid', () => {
    fixture.detectChanges();

    paramMapSubject.next(convertToParamMap({ id: null }));
    expect(blogServiceSpy.findOne).not.toHaveBeenCalled();

    paramMapSubject.next(convertToParamMap({ id: 'abc' }));
    expect(blogServiceSpy.findOne).not.toHaveBeenCalled();
  });

  it('should show info message if query param "messageShown" is "true"', fakeAsync(() => {
    fixture.detectChanges();

    queryParamsSubject.next({ messageShown: 'true' });

    tick(100); // attend 100ms pour le setTimeout

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Article',
      detail: 'L article a bien été créé.',
      life: 10000
    });
  }));

  it('should not show message if query param "messageShown" is not "true"', fakeAsync(() => {
    fixture.detectChanges();

    queryParamsSubject.next({ messageShown: 'false' });

    tick(100);

    expect(messageServiceSpy.add).not.toHaveBeenCalled();
  }));

  it('should handle error when findOne fails', () => {
    spyOn(console, 'error');

    blogServiceSpy.findOne.and.returnValue(throwError(() => new Error('Erreur réseau')));
    fixture.detectChanges();

    paramMapSubject.next(convertToParamMap({ id: '1' }));

    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des écoles', jasmine.any(Error));
    expect(component.isLoading).toBeFalse();
  });

  afterEach(() => {
    // Nettoyage des subscriptions
    if (component.routeSub) {
      component.routeSub.unsubscribe();
    }
  });
});
