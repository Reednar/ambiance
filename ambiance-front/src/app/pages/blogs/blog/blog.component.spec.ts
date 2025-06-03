import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogComponent } from './blog.component';
import { EcoleService } from '../../../service/ecole.service';
import { BlogService } from '../../../service/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Article } from '../../../entity/article';
import { Ecole } from '../../../entity/ecole';
import { RouterTestingModule } from '@angular/router/testing';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;

const mockEcoles: Ecole[] = [
  {
    id: 1,
    nom: 'Ecole 1',
    siteWeb: 'https://ecole1.fr',
    telephone: '0123456789',
    description: 'Description Ecole 1',
    typeEcole: 'Public',
    contactEail: 'contact@ecole1.fr',
    idCreateur: 'user1',
    codePostal: '75001',
    rue: '10 rue de Paris',
    ville: 'Paris',
    dateCreation: new Date('2020-01-01'),
    allowedDomain: 'ecole1.fr',
    image: 'image1.jpg'
  },
  {
    id: 2,
    nom: 'Ecole 2',
    siteWeb: 'https://ecole2.fr',
    telephone: '0987654321',
    description: 'Description Ecole 2',
    typeEcole: 'Privé',
    contactEail: 'contact@ecole2.fr',
    idCreateur: 'user2',
    codePostal: '69001',
    rue: '20 rue de Lyon',
    ville: 'Lyon',
    dateCreation: new Date('2021-05-15'),
    allowedDomain: 'ecole2.fr',
    image: 'image2.jpg'
  }
];


  const mockArticles: Article[] = [
    { id: 1, titre: 'Article 1', contenu: 'Contenu 1', dateCreation: new Date(), nomEcole: 'Ecole 1', idEcole: 1 },
    { id: 2, titre: 'Article 2', contenu: 'Contenu 2', dateCreation: new Date(), nomEcole: 'Ecole 2', idEcole: 2 },
    { id: 3, titre: 'Article 3', contenu: 'Contenu 3', dateCreation: new Date(), nomEcole: 'Ecole 1', idEcole: 1 }
  ];

  const ecoleServiceSpy = jasmine.createSpyObj('EcoleService', ['findAllSchools']);
  const blogServiceSpy = jasmine.createSpyObj('BlogService', ['list']);
  const activatedRouteStub = {
    queryParams: of({ ecole: '1' })  // Simule query param ecole=1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: EcoleService, useValue: ecoleServiceSpy },
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;

    // Spy retourne les données mockées
    ecoleServiceSpy.findAllSchools.and.returnValue(of(mockEcoles));
    blogServiceSpy.list.and.returnValue(of(mockArticles));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedSchools from queryParams and load ecoles and articles', async () => {
    // ngOnInit est appelé automatiquement par TestBed.createComponent + detectChanges
    fixture.detectChanges();

    // selectedSchools doit contenir l'id 1 issu des query params
    expect(component.selectedSchools.has(1)).toBeTrue();

    // Attendre que loadEcoles et loadArticles soient terminés
    await component.loadEcoles();
    await component.loadArticles();

    expect(component.ecoles.length).toBe(2);
    expect(component.articles.length).toBe(3);
  });

  it('loadEcoles should load ecoles and handle errors gracefully', async () => {
    ecoleServiceSpy.findAllSchools.and.returnValue(of(mockEcoles));
    await component.loadEcoles();
    expect(component.ecoles).toEqual(mockEcoles);

    // Simuler erreur
    ecoleServiceSpy.findAllSchools.and.returnValue(
      new Observable((observer: { error: (arg0: string) => void; }) => {
        observer.error('Erreur de test');
      })
    );
    await component.loadEcoles();
    // Ici on vérifie que le tableau n'est pas modifié (reste égal à l'ancien ou vide selon besoin)
    expect(component.ecoles).toEqual(mockEcoles);
  });

  it('loadArticles should load articles and handle errors gracefully', async () => {
    blogServiceSpy.list.and.returnValue(of(mockArticles));
    await component.loadArticles();
    expect(component.articles).toEqual(mockArticles);

    // Simuler erreur
    blogServiceSpy.list.and.returnValue(
      new Observable((observer: { error: (arg0: string) => void; }) => {
        observer.error('Erreur de test');
      })
    );
    await component.loadArticles();
    expect(component.articles).toEqual(mockArticles);
  });

  it('getSelectedSchools should return only schools selected', () => {
    component.ecoles = mockEcoles;
    component.selectedSchools = new Set([1]);
    const selected = component.getSelectedSchools();
    expect(selected.length).toBe(1);
    expect(selected[0].id).toBe(1);
  });

  it('filteredArticles should filter articles based on selectedSchools', () => {
    component.articles = mockArticles;
    component.selectedSchools = new Set();

    // Si aucune sélection, retourne tout
    let filtered = component.filteredArticles();
    expect(filtered.length).toBe(3);

    // Filtrer sur école 1
    component.selectedSchools = new Set([1]);
    filtered = component.filteredArticles();
    expect(filtered.length).toBe(2);
    expect(filtered.every(a => a.idEcole === 1)).toBeTrue();
  });

  it('toggleSchoolFilter should add or remove school IDs from selectedSchools', () => {
    component.selectedSchools = new Set();

    component.toggleSchoolFilter(1);
    expect(component.selectedSchools.has(1)).toBeTrue();

    component.toggleSchoolFilter(1);
    expect(component.selectedSchools.has(1)).toBeFalse();
  });
});
