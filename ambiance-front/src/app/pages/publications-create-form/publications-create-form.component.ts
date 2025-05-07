import { Component } from '@angular/core';
import { PublicationsService } from '../../service/publications.service';

@Component({
  selector: 'app-publications-create-form',
  templateUrl: './publications-create-form.component.html',
  styleUrls: ['./publications-create-form.component.scss']
})
export class PublicationsCreateFormComponent {
  step: number = 1;
  submitted: boolean = false;
  selectedFile: File | null = null;
  selectedCategoriesLabel: string = '';

  formData: any = {
    titre: '',
    date: null,
    nbPersonnes: null,
    prix: null,
    description: '',
    lieu: '',
    ville: '',
    placeHandicapee: false,
    autresFacilites: false,
    categories: []
  };

  categoriesOptions = [
    { name: 'Sport', selected: false },
    { name: 'Musique', selected: false },
    { name: 'Cuisine', selected: false },
    // Ajoute d'autres catégories ici
  ];

  constructor(private publicationsService: PublicationsService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  nextStep(): void {
    this.submitted = true;
    if (this.step === 1 && this.isStep1Valid()) {
      this.step++;
      this.submitted = false;
    } else if (this.step === 2 && this.isStep2Valid()) {
      this.step++;
      this.submitted = false;
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
      this.submitted = false;
    }
  }

  isStep1Valid(): boolean {
    return this.formData.titre && this.formData.date &&
           this.formData.nbPersonnes > 0 && this.formData.prix > 0 &&
           this.formData.description && this.formData.categories.length > 0;
  }

  isStep2Valid(): boolean {
    return this.formData.lieu && this.formData.ville;
  }

  updateSelectedCategories(): void {
    const selected = this.categoriesOptions
      .filter(c => c.selected)
      .map(c => c.name);

    this.formData.categories = selected;

    if (selected.length === 0) {
      this.selectedCategoriesLabel = '';
    } else if (selected.length === 1) {
      this.selectedCategoriesLabel = selected[0];
    } else if (selected.length <= 4) {
      this.selectedCategoriesLabel = selected.join(', ');
    } else {
      this.selectedCategoriesLabel = `${selected.length} catégories sélectionnées`;
    }
  }

  submit(): void {
    this.submitted = true;
    if (!this.isStep1Valid() || !this.isStep2Valid() || !this.selectedFile) {
      console.warn('Formulaire incomplet ou fichier manquant');
      return;
    }

    const formPayload = new FormData();
    for (const [key, value] of Object.entries(this.formData)) {
      if (key === 'categories') {
        formPayload.append(key, JSON.stringify(value));
      } else if (typeof value === 'string' || value instanceof Blob) {
        formPayload.append(key, value);
      } else {
        console.warn(`FormData key '${key}' has unsupported type`, value);
      }
    }
    formPayload.append('placeHandicapee', this.formData.placeHandicapee ? 'true' : 'false');    
    if (this.selectedFile) {
      formPayload.append('image', this.selectedFile);
    }

    this.publicationsService.create(formPayload).subscribe({
      next: res => console.log('✅ Publication créée', res),
      error: err => console.error('❌ Erreur création publication', err)
    });
  }

  filterPublications(): void {
    console.log("Filtrage éventuel à faire ici.");
  }
}
