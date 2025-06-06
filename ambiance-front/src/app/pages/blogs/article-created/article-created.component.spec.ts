import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ArticleCreatedComponent } from './article-created.component';
import { BlogService } from '../../../service/blog.service';
import { Article } from '../../../entity/article';

describe('ArticleCreatedComponent', () => {
  let component: ArticleCreatedComponent;
  let fixture: ComponentFixture<ArticleCreatedComponent>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;

const mockArticles: Article[] = [
  { id: 1, contenu: 'Contenu 1', dateCreation: new Date('2025-01-01'), nomEcole: 'Ecole A' },
  { id: 2, contenu: 'Contenu 2', dateCreation: new Date('2025-01-02'), nomEcole: 'Ecole B' },
  { id: 3, contenu: 'Contenu 3', dateCreation: new Date('2025-01-03'), nomEcole: 'Ecole C' },
  { id: 4, contenu: 'Contenu 4', dateCreation: new Date('2025-01-04'), nomEcole: 'Ecole D' },
  { id: 5, contenu: 'Contenu 5', dateCreation: new Date('2025-01-05'), nomEcole: 'Ecole E' },
  { id: 6, contenu: 'Contenu 6', dateCreation: new Date('2025-01-06'), nomEcole: 'Ecole F' },
];


  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BlogService', ['findAllByAuthor', 'delete']);

    await TestBed.configureTestingModule({
      declarations: [ArticleCreatedComponent],
      providers: [
        { provide: BlogService, useValue: spy }
      ]
    }).compileComponents();

    blogServiceSpy = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;

    // Mock sessionStorage.getItem for userId
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'id_utilisateur') return '123';
      return null;
    });

    fixture = TestBed.createComponent(ArticleCreatedComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles on ngOnInit and paginate correctly', fakeAsync(() => {
    blogServiceSpy.findAllByAuthor.and.returnValue(of(mockArticles));

    component.ngOnInit();
    tick(); // simulate async passage of time

    expect(component.userId).toBe('123');
    expect(blogServiceSpy.findAllByAuthor).toHaveBeenCalledWith(123);
    expect(component.articles.length).toBe(mockArticles.length);
    expect(component.totalPages).toBe(Math.ceil(mockArticles.length / component.pageSize));
    expect(component.paginatedArticles.length).toBe(component.pageSize);
    expect(component.paginatedArticles[0].id).toBe(1);
  }));

  it('should handle error when loading articles', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    blogServiceSpy.findAllByAuthor.and.returnValue(throwError(() => new Error('error')));
    
    component.ngOnInit();
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de la récupération des écoles', jasmine.any(Error));
    expect(component.articles.length).toBe(0);
  }));

  it('should go to next page', () => {
    component.articles = mockArticles;
    component.totalPages = Math.ceil(mockArticles.length / component.pageSize);
    component.currentPage = 1;

    component.updatePageData();

    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(component.paginatedArticles[0].id).toBe(6); // page 2 should start at article 6
  });

  it('should not go to next page if on last page', () => {
    component.articles = mockArticles;
    component.totalPages = Math.ceil(mockArticles.length / component.pageSize);
    component.currentPage = component.totalPages;

    component.updatePageData();

    component.nextPage();

    expect(component.currentPage).toBe(component.totalPages);
  });

  it('should go to previous page', () => {
    component.articles = mockArticles;
    component.totalPages = Math.ceil(mockArticles.length / component.pageSize);
    component.currentPage = 2;

    component.updatePageData();

    component.prevPage();

    expect(component.currentPage).toBe(1);
    expect(component.paginatedArticles[0].id).toBe(1);
  });

  it('should not go to previous page if on first page', () => {
    component.articles = mockArticles;
    component.totalPages = Math.ceil(mockArticles.length / component.pageSize);
    component.currentPage = 1;

    component.updatePageData();

    component.prevPage();

    expect(component.currentPage).toBe(1);
  });

  it('should go to specific page with goToPage', () => {
    component.articles = mockArticles;
    component.totalPages = Math.ceil(mockArticles.length / component.pageSize);

    component.goToPage(2);

    expect(component.currentPage).toBe(2);
    expect(component.paginatedArticles[0].id).toBe(6);
  });

  it('should not go to invalid page with goToPage', () => {
    component.articles = mockArticles;
    component.totalPages = Math.ceil(mockArticles.length / component.pageSize);

    component.currentPage = 1;
    component.goToPage(0);
    expect(component.currentPage).toBe(1);

    component.goToPage(component.totalPages + 1);
    expect(component.currentPage).toBe(1);
  });

  it('should delete article when confirmed and reload articles', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    blogServiceSpy.delete.and.returnValue(of(void 0));
    blogServiceSpy.findAllByAuthor.and.returnValue(of(mockArticles));

    component.deleteArticle(1);
    tick();

    expect(blogServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(blogServiceSpy.findAllByAuthor).toHaveBeenCalled();
  }));

  it('should not delete article when confirmation is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteArticle(1);
    expect(blogServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should log error when delete fails', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    const consoleSpy = spyOn(console, 'error');
    blogServiceSpy.delete.and.returnValue(throwError(() => new Error('delete error')));

    component.deleteArticle(1);
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de la suppression', jasmine.any(Error));
  }));
});
