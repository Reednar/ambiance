import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-publications-create-form',
  templateUrl: './publications-create-form.component.html',
  styleUrls: ['./publications-create-form.component.scss']
})
export class PublicationsCreateFormComponent {
  step: number = 1;
  submitted: boolean = false;
  form: FormGroup;
  selectedDate: string = '';
  selectedCategoriesLabel: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titre: [''],
      date: [null],
      nbPersonnes: [0],
      prix: [0],
      description: [''],
      categories: [], // <- ici, la vraie liste de catégories sélectionnées
      placeHandicapee: [false],
      rampeAcces: [false],
      parkingHandicape: [false]
    });
  }

  formData: any = {
    titre: '',
    date: null,
    nbPersonnes: null,
    prix: null,
    description: '',
    categories: [],
    lieu: '',
    ville: '',
    rampeAcces: false,
    placeHandicapee: false
  };

  categories = [
    { name: 'Catégorie 1', selected: false },
    { name: 'Catégorie 2', selected: false },
    { name: 'Catégorie 3', selected: false },
    // Ajouter d'autres catégories ici
  ];

  // categoriesOptions = [
  //   { label: 'Musique', value: 'musique' },
  //   { label: 'Sport', value: 'sport' },
  //   { label: 'Cuisine', value: 'cuisine' },
  //   { label: 'Culture', value: 'culture' }
  // ];

  categoriesOptions = [
    { name: 'Sport', selected: false },
    { name: 'Musique', selected: false },
    { name: 'Cuisine', selected: false },
    // Ajoute tes vraies catégories ici
  ];
  nextStep() {
    this.submitted = true;

    // Vérifier les champs obligatoires avant de passer à l'étape suivante
    if (this.step === 1 && this.isStep1Valid()) {
      this.step++;
      this.submitted = false;
    } else if (this.step === 2 && this.isStep2Valid()) {
      this.step++;
      this.submitted = false;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
      this.submitted = false;
    }
  }

  isStep1Valid() {
    return this.formData.titre && this.formData.date && this.formData.nbPersonnes > 0 && this.formData.prix > 0 && this.formData.description && this.formData.categories.length > 0;
  }

  isStep2Valid() {
    return this.formData.lieu && this.formData.ville;
  }

  submit() {
    console.log('Formulaire envoyé :', this.formData);
    // ici tu peux envoyer ton formData à ton backend !
  }

  filterPublications() {
    // this.filteredPublications = this.publications.filter(pub => {
    //   const matchesSearch = pub.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
    //   const matchesCategory = !this.selectedCategory || pub.categories.includes(this.selectedCategory);
    //   const matchesMultiSelect = !this.selectedCategories.length || this.selectedCategories.some(cat => pub.categories.includes(cat));
      
    //   return matchesSearch && matchesCategory && matchesMultiSelect;
  //});
  console.log("filter");
  }

  updateSelectedCategories() {
    const selected = this.categoriesOptions
      .filter(c => c.selected)
      .map(c => c.name);
  
    this.formData.categories = selected;
  
    if (selected.length === 0) {
      this.selectedCategoriesLabel = '';
    } else if (selected.length === 1) {
      this.selectedCategoriesLabel = selected[0];
    } else if (selected.length <= 4){
      this.selectedCategoriesLabel = selected.join(', ');
    }
    else{
      this.selectedCategoriesLabel = `${selected.length} catégories sélectionnées`;
    }
  }
}
