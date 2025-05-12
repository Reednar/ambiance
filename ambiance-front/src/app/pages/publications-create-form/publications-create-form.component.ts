import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PublicationsService } from '../../service/publications.service';
import { CategoriesService } from '../../service/categories.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-publications-create-form',
  templateUrl: './publications-create-form.component.html',
  styleUrls: ['./publications-create-form.component.scss']
})
export class PublicationsCreateFormComponent implements OnInit {
  step: number = 1;
  submitted: boolean = false;
  selectedFile: File | null = null;
  selectedCategoriesLabel: string = '';
  placeHandicapee: boolean = false;
  @ViewChild('inputVille', { static: false }) inputVille: ElementRef | undefined;
  @ViewChild('inputRue', { static: false }) inputRue: ElementRef | undefined;
  suggestedStreets: any[] = [];
  categories: any;
  suggestedCities: any[] = [];
  userId: string = '';
  fileName: string | null = null;


  formData: any = {
    titre: '',
    dateEvenement: null,
    participantMax: null,
    participantMin: null,
    prix: null,
    description: '',
    ville: '',
    rue: '',
    typePost: 'Evenement',
    codePostal: '',
    placeHandicape: false,
    rampe: false,
    ascenseur: false,
    categories: [],
    lien: '',
    utilisateurId: '',
  };

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id_utilisateur') ?? '';
    this.formData.utilisateurId = this.userId;
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data: any) => {
        this.categories = data;
        this.categories.forEach((category: any) => {
          category.selected = false;
        });
      },
      error: (err: any) => console.error('Erreur chargement catégories :', err),
    });
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.fileName = null;
    const fileInput: HTMLInputElement = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  nextStep(): void {
    this.submitted = true;
    if (this.step === 1 && this.isStep1Valid()) {
      this.step++;
      this.submitted = false;
    } else if (this.step === 2 && this.isStep2Valid()) {
      this.step++;
      this.submitted = false;
    } else if (this.step === 3) {
      this.step++;
    }
  }
  previousStep(): void {
    if (this.step > 1) {
      this.step--;
      this.submitted = false;
    }
  }
  isStep1Valid(): boolean {
    return this.formData.titre && this.formData.dateEvenement &&
      this.formData.participantMax > 0 && this.formData.prix > 0 &&
      this.formData.description && this.formData.categories.length > 0;
  }

  isStep2Valid(): boolean {
    return this.formData.codePostal && this.formData.ville;
  }

  updateSelectedCategories(): void {
    const selectedCategories = this.categories
      .filter((c: { selected: any; }) => c.selected);

    this.formData.categories = selectedCategories.map((c: { idCategorie: any; }) => c.idCategorie);

    if (selectedCategories.length === 0) {
      this.selectedCategoriesLabel = '';
    } else if (selectedCategories.length === 1) {
      this.selectedCategoriesLabel = selectedCategories[0].nom;
    } else if (selectedCategories.length <= 4) {
      this.selectedCategoriesLabel = selectedCategories.map((c: { nom: any; }) => c.nom).join(', ');
    } else {
      this.selectedCategoriesLabel = `${selectedCategories.length} catégories sélectionnées`;
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
      } else if (typeof value === 'boolean') {
        formPayload.append(key, value.toString());
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        value instanceof Blob
      ) {
        formPayload.append(key, value.toString());
      } else if (value !== null && value !== undefined) {
        formPayload.append(key, JSON.stringify(value));
      } else {
        console.warn(`FormData key '${key}' has unsupported type`, value);
      }
    }

    if (this.selectedFile) {
      formPayload.append('image', this.selectedFile);
    }

    this.publicationsService.create(formPayload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Publication créée', detail: 'La publication a bien été créée.' });

        if (res && res.publication.idPublication) {
          const idPublication = res.publication.idPublication;
          this.router.navigate([`/publication-show/${idPublication}`], {
            queryParams: { messageShown: 'true' },
          })
        } else {
          console.error('Aucun ID de publication trouvé dans la réponse');
        }
      },
      error: (err) => {
        console.error('❌ Erreur création publication', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création de la publication.' });
      },
    });
  }

  onCityInput(event: any): void {
    const query = event.target.value;
    if (query && query.length >= 3) {
      this.getCitySuggestions(query);
    } else {
      this.suggestedCities = [];
    }
  }

  closeSuggestions(): void {
    this.suggestedCities = [];
  }

  getCitySuggestions(query: string): void {
    const apiKey = '91f12b2c1fd04e25b590b5f5841d21ac'; // Geoapify
    const url = `/api/v1/geocode/autocomplete?text=${query}&lang=fr&apiKey=91f12b2c1fd04e25b590b5f5841d21ac`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.suggestedCities = response.features;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des suggestions de villes:', err);
      },
    });
  }

  onCitySelect(city: any): void {
    this.formData.ville = city.properties.city || city.properties.name;
    this.formData.codePostal = city.properties.postcode || '';
    this.suggestedCities = [];
  }

  clearInput(event: MouseEvent): void {
    event.stopPropagation();
    this.formData.ville = '';
    this.suggestedCities = [];
  }

  @HostListener('document:click', ['$event'])
  onContainerClick(event: MouseEvent): void {
    if (this.inputVille != undefined)
      var clickedInside = this.inputVille.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.suggestedCities = [];
    }
  }

  @HostListener('document:click', ['$event'])
  onContainerClickStreet(event: MouseEvent): void {
    if (this.inputRue != undefined)
      var clickedInside = this.inputRue.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.suggestedStreets = [];
    }
  }


  // Méthode pour gérer l'input de la rue
  onStreetInput(event: any): void {
    const query = event.target.value;
    if (query && query.length >= 3) {
      this.getStreetSuggestions(query);
    } else {
      this.suggestedStreets = [];
    }
  }

  // Méthode pour récupérer les suggestions de rues
  getStreetSuggestions(query: string): void {
    const apiKey = '91f12b2c1fd04e25b590b5f5841d21ac'; // Ta clé Geoapify
    const url = `/api/v1/geocode/autocomplete?text=${query}&lang=fr&apiKey=${apiKey}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.suggestedStreets = response.features;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des suggestions de rues:', err);
      },
    });
  }

  // Méthode pour remplir la rue, la ville et le code postal quand l'utilisateur sélectionne une rue
  onStreetSelect(street: any): void {
    this.formData.rue = street.properties.street || street.properties.name;
    this.formData.ville = street.properties.city || street.properties.city_name;
    this.formData.codePostal = street.properties.postcode || 'Code Postal Inconnu';
    this.suggestedStreets = [];
  }

  // Méthode pour vider l'input de la rue
  clearStreetInput(event: any): void {
    event.stopPropagation();
    this.formData.rue = '';
    this.formData.ville = '';
    this.formData.codePostal = '';
    this.suggestedStreets = [];
  }
}
