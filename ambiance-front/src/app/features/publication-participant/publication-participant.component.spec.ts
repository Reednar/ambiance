import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationParticipantComponent } from './publication-participant.component';

describe('PublicationParticipantComponent', () => {
  let component: PublicationParticipantComponent;
  let fixture: ComponentFixture<PublicationParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicationParticipantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicationParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
