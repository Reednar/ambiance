import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/authent.service';
import { UsersService } from '../../service/users.service';
import { CategoriesService } from '../../service/categories.service';
import { PublicationsService } from '../../service/publications.service';

// Mocks pour les services utilisés
class MockPublicationsService {
  getAll() {
    return of([
      { dateCreation: new Date().toISOString() },
      { dateCreation: new Date(Date.now() - 1000).toISOString() },
    ]);
  }
}

class MockCategoriesService {
  findOneDto(id: number) {
    return of({ id, name: `Category ${id}` });
  }
}

class MockUsersService {
  validateUserWithToken() {
    return of(null);
  }
}

class MockAuthService {
  isAuthenticated() {
    return of(true);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // On crée un Subject pour simuler queryParams dynamiquement
  const queryParamsSubject = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: queryParamsSubject.asObservable() } },
        { provide: PublicationsService, useClass: MockPublicationsService },
        { provide: CategoriesService, useClass: MockCategoriesService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: AuthService, useClass: MockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();  // déclenche ngOnInit()
    expect(component).toBeTruthy();
  });

  it('should load publications on init', () => {
    fixture.detectChanges();
    expect(component.publications.length).toBeGreaterThan(0);
  });

  it('should load categories on init', () => {
    fixture.detectChanges();
    expect(component.sport).toBeTruthy();
    expect(component.musique).toBeTruthy();
    expect(component.cinema).toBeTruthy();
    expect(component.voyage).toBeTruthy();
  });

  it('should validate user if token param exists', fakeAsync(() => {
    const usersService = TestBed.inject(UsersService);
    spyOn(usersService, 'validateUserWithToken').and.returnValue(
      of({ id: 1, email: 'test@example.com', roles: ['admin'] }) // exemple de User
    );

    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'isAuthenticated').and.returnValue(
      of({ authenticated: true, emailConfirmed: true })
    );

    fixture.detectChanges();

    queryParamsSubject.next({ token: '12345' });

    tick(); // Avance le timer pour gérer les souscriptions

    expect(usersService.validateUserWithToken).toHaveBeenCalledWith('12345');
    expect(authService.isAuthenticated).toHaveBeenCalled();
  }));

  it('should alert on validation success', fakeAsync(() => {
    spyOn(window, 'alert');
    const usersService = TestBed.inject(UsersService);

    spyOn(usersService, 'validateUserWithToken').and.returnValue(
      of({ id: 1, email: 'test@example.com', roles: ['admin'] })
    );

    fixture.detectChanges();
    queryParamsSubject.next({ token: 'token-success' });
    tick();

    expect(window.alert).toHaveBeenCalledWith('Votre compte a été validé avec succès !');
  }));

  it('should alert on validation failure', fakeAsync(() => {
    spyOn(window, 'alert');
    const usersService = TestBed.inject(UsersService);

    spyOn(usersService, 'validateUserWithToken').and.returnValue(
      throwError(() => new Error('Invalid token'))
    );

    fixture.detectChanges();
    queryParamsSubject.next({ token: 'token-error' });
    tick();

    expect(window.alert).toHaveBeenCalledWith('Le lien de validation est invalide ou expiré.');
  }));

});
