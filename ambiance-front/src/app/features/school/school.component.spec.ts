import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SchoolComponent } from './school.component';
import { EcoleService } from '../../core/services/ecole.service';
import { Ecole } from '../../core/models/ecole';

// Mock du service
class MockEcoleService {
  findAllSchools() {
    return of([
      { id: 1, nom: 'Ecole 1' } as Ecole,
      { id: 2, nom: 'Ecole 2' } as Ecole
    ]);
  }
}

describe('SchoolComponent', () => {
  let component: SchoolComponent;
  let fixture: ComponentFixture<SchoolComponent>;
  let ecoleService: EcoleService;


beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({
    declarations: [SchoolComponent],
    imports: [RouterTestingModule], // <-- ici !
    providers: [
      { provide: EcoleService, useClass: MockEcoleService }
    ]
  }).compileComponents();
}));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolComponent);
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
