import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleFormComponent } from './article-form.component';
import { BlogService } from '../../../core/services/blog.service';
import { EcoleService } from '../../../core/services/ecole.service';
import { of } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ArticleFormComponent', () => {
  let component: ArticleFormComponent;
  let fixture: ComponentFixture<ArticleFormComponent>;


  const mockTags = [
    { id: 1, nom: 'Tag1' },
    { id: 2, nom: 'Tag2' },
    { id: 3, nom: 'Tag3' }
  ];

  const blogServiceSpy = jasmine.createSpyObj('BlogService', ['getAllTags']);
  const ecoleServiceSpy = jasmine.createSpyObj('EcoleService', ['someMethod']); // mets les méthodes dont tu as besoin


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleFormComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: EcoleService, useValue: ecoleServiceSpy }
      ],
    }).compileComponents();

    blogServiceSpy.getAllTags.and.returnValue(of(mockTags));

    fixture = TestBed.createComponent(ArticleFormComponent);
    component = fixture.componentInstance;

    component.article = {
      titre: 'Test Article',
      image: 'image.png',
      contenu: 'Contenu',
      ecoleId: 1,
      tagIds: [1, 3]
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tags and update selectedTags on ngOnInit', () => {
    component.ngOnInit();
    expect(blogServiceSpy.getAllTags).toHaveBeenCalled();
    // selectedTags should contain tags with ids 1 and 3
    expect(component.selectedTags.length).toBe(2);
    expect(component.selectedTags.map(t => t.id)).toEqual([1, 3]);
  });

  it('should update selectedTags on ngOnChanges when article input changes', () => {
    component.ngOnInit(); // Load tags first
    component.article = {
      ...component.article,
      tagIds: [2]
    };
    component.ngOnChanges({
      article: new SimpleChange(null, component.article, false)
    });
    expect(component.selectedTags.length).toBe(1);
    expect(component.selectedTags[0].id).toBe(2);
  });

  it('should add tag to selectedTags when toggleTagSelection is checked', () => {
    component.ngOnInit();
    const newTag = { id: 2, nom: 'Tag2' };
    const event = { target: { checked: true } } as unknown as Event;
    component.toggleTagSelection(newTag, event);
    expect(component.selectedTags.some(t => t.id === 2)).toBeTrue();
  });

  it('should remove tag from selectedTags when toggleTagSelection is unchecked', () => {
    component.ngOnInit();
    const tagToRemove = { id: 1, nom: 'Tag1' };
    const event = { target: { checked: false } } as unknown as Event;
    component.toggleTagSelection(tagToRemove, event);
    expect(component.selectedTags.some(t => t.id === 1)).toBeFalse();
  });

  it('isSelected should return true if tag is selected', () => {
    component.ngOnInit();
    expect(component.isSelected({ id: 1, nom: 'Tag1' })).toBeTrue();
  });

  it('isSelected should return false if tag is not selected', () => {
    component.ngOnInit();
    expect(component.isSelected({ id: 99, nom: 'NonExistent' })).toBeFalse();
  });

  it('getSelectedTagsLabel should return joined names if tags selected', () => {
    component.ngOnInit();
    const label = component.getSelectedTagsLabel();
    expect(label).toBe('Tag1, Tag3');
  });

  it('getSelectedTagsLabel should return default string if no tags selected', () => {
    component.selectedTags = [];
    const label = component.getSelectedTagsLabel();
    expect(label).toBe('Sélectionner des tags');
  });

  it('should emit submitForm event with article data including selected tagIds on valid form submit', () => {
    component.ngOnInit();
    spyOn(component.submitForm, 'emit');

    const fakeForm = {
      valid: true
    } as NgForm;

    component.onSubmit(fakeForm);

    expect(component.submitForm.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      tagIds: component.selectedTags.map(t => t.id)
    }));
  });

  it('should NOT emit submitForm event if form is invalid', () => {
    spyOn(component.submitForm, 'emit');

    const fakeForm = {
      valid: false
    } as NgForm;

    component.onSubmit(fakeForm);

    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });
});
