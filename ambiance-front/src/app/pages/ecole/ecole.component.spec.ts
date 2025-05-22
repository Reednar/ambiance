import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoleComponent } from './ecole.component';

describe('EcoleComponent', () => {
  let component: EcoleComponent;
  let fixture: ComponentFixture<EcoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
