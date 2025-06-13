import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCreateComponent } from './article-create.component';
import { BlogService } from '../../core/services/blog.service';
import { EcoleService } from '../../core/services/ecole.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ArticleCreateComponent', () => {
  let component: ArticleCreateComponent;
  let fixture: ComponentFixture<ArticleCreateComponent>;

  // Mocks des services
  const mockBlogService = jasmine.createSpyObj('BlogService', ['createArticle']);
  const mockEcoleService = jasmine.createSpyObj('EcoleService', ['findSchoolByUserId']);
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

  const mockEcole = {
    id: 123,
    nom: 'Ecole Test',
    siteWeb: 'https://ecole.test',
    telephone: '0123456789',
    description: 'Desc',
    typeEcole: 'Public',
    contactEail: 'contact@test.fr',
    idCreateur: 'user1',
    codePostal: '75001',
    rue: '10 rue Test',
    ville: 'Paris',
    dateCreation: new Date(),
    allowedDomain: 'ecole.test',
    image: 'img.jpg'
  };

  beforeEach(async () => {
    // Simule sessionStorage.getItem('id_utilisateur')
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'id_utilisateur') return '42';
      return null;
    });

    await TestBed.configureTestingModule({
      declarations: [ArticleCreateComponent],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: EcoleService, useValue: mockEcoleService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService },
      ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load school on ngOnInit', () => {
    mockEcoleService.findSchoolByUserId.and.returnValue(of(mockEcole));

    component.ngOnInit();

    expect(mockEcoleService.findSchoolByUserId).toHaveBeenCalledWith(42);
    expect(component.ecole).toEqual(mockEcole);
    expect(component.nomEcole).toBe('Ecole Test');
  });

  it('should call blogService.createArticle and navigate after onSubmit', () => {
    const articleData = { titre: 'Mon article', contenu: 'Contenu' };
    const responseMock = { idArticle: 555 };

    mockBlogService.createArticle.and.returnValue(of(responseMock));

    component.ecole = mockEcole;  // Pour avoir un id_ecole correct

    component.onSubmit(articleData);

    expect(mockBlogService.createArticle).toHaveBeenCalledWith({
      ...articleData,
      idAuteur: 42,
      id_ecole: 123
    });

    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Publication créée'
    }));

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/article', 555]);
  });
});
