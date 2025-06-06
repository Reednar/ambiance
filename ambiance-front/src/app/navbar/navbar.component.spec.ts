import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../service/authent.service';
import { PublicationsService } from '../service/publications.service';
import { UsersService } from '../service/users.service';
import { SearchService } from '../service/search.service';
import { EcoleService } from '../service/ecole.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

// Mocks simples pour les services (à adapter selon les besoins)
class MockAuthService {
  isConnected$ = of(true);
  emailConfirmed$ = of(true);
  logout() { return of(null); }
}
class MockPublicationsService {
  getAll() { return of([]); }
}
class MockUsersService {
  getUsers() { return of([]); }
}
class MockSearchService {
  initialize() {}
  search() { return []; }
}
class MockEcoleService {
  findAllSchools() { return of([]); }
}
class MockMessageService {
  add() {}
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: PublicationsService, useClass: MockPublicationsService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: SearchService, useClass: MockSearchService },
        { provide: EcoleService, useClass: MockEcoleService },
        { provide: MessageService, useClass: MockMessageService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
