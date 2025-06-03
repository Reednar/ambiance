import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { EcoleComponent } from './ecole.component';
import { EcoleService } from '../../service/ecole.service';
import { Ecole } from '../../entity/ecole';

// Mock du service
class MockEcoleService {
  findAllSchools() {
    return of([
      { id: 1, nom: 'Ecole 1' } as Ecole,
      { id: 2, nom: 'Ecole 2' } as Ecole
    ]);
  }
}

describe('EcoleComponent', () => {
  let component: EcoleComponent;
  let fixture: ComponentFixture<EcoleComponent>;
  let ecoleService: EcoleService;


beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({
    declarations: [EcoleComponent],
    imports: [RouterTestingModule], // <-- ici !
    providers: [
      { provide: EcoleService, useClass: MockEcoleService }
    ]
  }).compileComponents();
}));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoleComponent);
    component = fixture.componentInstance;
    ecoleService = TestBed.inject(EcoleService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load schools on init', waitForAsync(() => {
    fixture.detectChanges(); // déclenche ngOnInit et loadEcoles()

    fixture.whenStable().then(() => {
      expect(component.ecoles.length).toBe(2);
      expect(component.ecoles[0].nom).toBe('Ecole 1');
    });
  }));

  it('should handle error when loading schools', waitForAsync(() => {
    // Mock du service qui renvoie une erreur
    spyOn(ecoleService, 'findAllSchools').and.returnValue(throwError(() => new Error('Erreur')));
    
    fixture.detectChanges(); // ngOnInit

    fixture.whenStable().then(() => {
      expect(component.ecoles.length).toBe(0);  // liste vide en cas d'erreur
    });
  }));

});
