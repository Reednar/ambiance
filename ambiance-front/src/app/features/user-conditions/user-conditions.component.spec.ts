import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConditionsComponent } from './user-conditions.component';

describe('UserConditionsComponent', () => {
  let component: UserConditionsComponent;
  let fixture: ComponentFixture<UserConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserConditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
