import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCreatedComponent } from './article-created.component';

describe('ArticleCreatedComponent', () => {
  let component: ArticleCreatedComponent;
  let fixture: ComponentFixture<ArticleCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleCreatedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
