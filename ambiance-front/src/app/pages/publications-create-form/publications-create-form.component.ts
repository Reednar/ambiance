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
  step: number = 1; // Étape actuelle du formulaire (multi-step)
  submitted: boolean = false; // Indique si le formulaire a été soumis (pour validation)
  selectedFile: File | null = null; // Fichier sélectionné pour upload
  selectedCategoriesLabel: string = ''; // Label affiché des catégories sélectionnées
  placeHandicapee: boolean = false; // Indique si le lieu est accessible aux personnes handicapées
  @ViewChild('inputVille', { static: false }) inputVille: ElementRef | undefined; // Référence à l'input ville pour gérer les clics hors focus
  @ViewChild('inputRue', { static: false }) inputRue: ElementRef | undefined; // Référence à l'input rue pour gérer les clics hors focus
  suggestedStreets: any[] = []; // Suggestions de rues pour l'autocomplétion
  categories: any; // Liste des catégories chargées depuis le service
  suggestedCities: any[] = []; // Suggestions de villes pour l'autocomplétion
  userId: string = ''; // ID utilisateur récupéré depuis la session
  fileName: string | null = null; // Nom du fichier sélectionné

  // Objet contenant les données du formulaire
  formData: any = {
    titre: '',
    dateEvenement: null,
    participantMax: null,
    participantMin: null,
    prix: null,
    description: '',
    ville: '',
    rue: '',
    typePost: 'Evenement', // Type de publication
    codePostal: '',
    placeHandicape: false,
    rampe: false,
    ascenseur: false,
    categories: [], // Liste des IDs des catégories sélectionnées
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
    // Récupérer l'ID utilisateur en session et l'assigner au formulaire
    this.userId = sessionStorage.getItem('id_utilisateur') ?? '';
    this.formData.utilisateurId = this.userId;
    this.loadCategories(); // Charger les catégories disponibles
  }

  // Charger toutes les catégories depuis le service
  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data: any) => {
        this.categories = data;
        // Initialiser la propriété selected pour gérer la sélection dans l'UI
        this.categories.forEach((category: any) => {
          category.selected = false;
        });
      },
      error: (err: any) => console.error('Erreur chargement catégories :', err),
    });
  }

  // Gestion de la sélection d'un fichier dans l'input
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name; // Afficher le nom du fichier choisi
    }
  }

  // Réinitialiser la sélection de fichier
  clearFile(): void {
    this.selectedFile = null;
    this.fileName = null;
    const fileInput: HTMLInputElement = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Vider le champ input file dans le DOM
    }
  }

  // Passer à l'étape suivante du formulaire
  nextStep(): void {
    this.submitted = true; // Marquer la tentative de validation
    if (this.step === 1 && this.isStep1Valid()) {
      this.step++; // Passer à l'étape 2 si valide
      this.submitted = false;
    } else if (this.step === 2 && this.isStep2Valid()) {
      this.step++; // Passer à l'étape 3 si valide
      this.submitted = false;
    } else if (this.step === 3) {
      this.step++; // Étape 4 sans validation spécifique
    }
  }

  // Revenir à l'étape précédente
  previousStep(): void {
    if (this.step > 1) {
      this.step--;
      this.submitted = false;
    }
  }

  // Validation des champs de la première étape
  isStep1Valid(): boolean {
    return this.formData.titre && this.formData.dateEvenement &&
      this.formData.participantMax > 0 && this.formData.prix > 0 &&
      this.formData.description && this.formData.categories.length > 0;
  }

  // Validation des champs de la deuxième étape
  isStep2Valid(): boolean {
    return this.formData.codePostal && this.formData.ville;
  }

  // Mettre à jour la liste des catégories sélectionnées
  updateSelectedCategories(): void {
    const selectedCategories = this.categories
      .filter((c: { selected: any; }) => c.selected);

    // Mettre à jour l'array des IDs des catégories sélectionnées dans formData
    this.formData.categories = selectedCategories.map((c: { idCategorie: any; }) => c.idCategorie);

    // Construire un label lisible pour l'affichage
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

  // Soumission finale du formulaire
  submit(): void {
  this.submitted = true;

  if (!this.isFormValid()) {
    console.warn('Formulaire incomplet ou fichier manquant');
    return;
  }

  const formPayload = this.buildFormData();

  this.publicationsService.create(formPayload).subscribe({
    next: (res) => this.handleSuccess(res),
    error: (err) => this.handleError(err),
  });
}

private isFormValid(): boolean {
  return this.isStep1Valid() && this.isStep2Valid() && !!this.selectedFile;
}

private buildFormData(): FormData {
  const formPayload = new FormData();

  for (const [key, value] of Object.entries(this.formData)) {
    this.appendFormValue(formPayload, key, value);
  }

  if (this.selectedFile) {
    formPayload.append('image', this.selectedFile);
  }

  return formPayload;
}

private appendFormValue(formData: FormData, key: string, value: any): void {
  if (key === 'categories') {
    formData.append(key, JSON.stringify(value));
  } else if (typeof value === 'boolean') {
    formData.append(key, value.toString());
  } else if (typeof value === 'string' || typeof value === 'number' || value instanceof Blob) {
    formData.append(key, value.toString());
  } else if (value !== null && value !== undefined) {
    formData.append(key, JSON.stringify(value));
  } else {
    console.warn(`FormData key '${key}' has unsupported type`, value);
  }
}

private handleSuccess(res: any): void {
  this.messageService.add({ severity: 'success', summary: 'Publication créée', detail: 'La publication a bien été créée.' });

  if (res?.publication?.idPublication) {
    this.router.navigate([`/publication-show/${res.publication.idPublication}`], {
      queryParams: { messageShown: 'true' },
    });
  } else {
    console.error('Aucun ID de publication trouvé dans la réponse');
  }
}

private handleError(err: any): void {
  console.error('❌ Erreur création publication', err);
  this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création de la publication.' });
}

  // submit(): void {
  //   this.submitted = true;

  //   // Vérifier la validité des étapes et la présence d'un fichier
  //   if (!this.isStep1Valid() || !this.isStep2Valid() || !this.selectedFile) {
  //     console.warn('Formulaire incomplet ou fichier manquant');
  //     return;
  //   }

  //   // Préparer les données dans un FormData pour envoi multipart/form-data
  //   const formPayload = new FormData();
  //   for (const [key, value] of Object.entries(this.formData)) {
  //     if (key === 'categories') {
  //       // Sérialiser la liste des catégories
  //       formPayload.append(key, JSON.stringify(value));
  //     } else if (typeof value === 'boolean') {
  //       // Convertir les booléens en string
  //       formPayload.append(key, value.toString());
  //     } else if (
  //       typeof value === 'string' ||
  //       typeof value === 'number' ||
  //       value instanceof Blob
  //     ) {
  //       formPayload.append(key, value.toString());
  //     } else if (value !== null && value !== undefined) {
  //       // Sérialiser tout objet JSON
  //       formPayload.append(key, JSON.stringify(value));
  //     } else {
  //       console.warn(`FormData key '${key}' has unsupported type`, value);
  //     }
  //   }

  //   // Ajouter le fichier image sélectionné
  //   if (this.selectedFile) {
  //     formPayload.append('image', this.selectedFile);
  //   }

  //   // Envoyer les données au service
  //   this.publicationsService.create(formPayload).subscribe({
  //     next: (res) => {
  //       // Afficher un message de succès
  //       this.messageService.add({ severity: 'success', summary: 'Publication créée', detail: 'La publication a bien été créée.' });

  //       // Rediriger vers la page de détail de la publication créée
  //       if (res && res.publication.idPublication) {
  //         const idPublication = res.publication.idPublication;
  //         this.router.navigate([`/publication-show/${idPublication}`], {
  //           queryParams: { messageShown: 'true' },
  //         })
  //       } else {
  //         console.error('Aucun ID de publication trouvé dans la réponse');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('❌ Erreur création publication', err);
  //       this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création de la publication.' });
  //     },
  //   });
  // }

  // Gestion de la saisie dans le champ ville pour autocomplétion
  onCityInput(event: any): void {
    const query = event.target.value;
    if (query && query.length >= 3) {
      this.getCitySuggestions(query);
    } else {
      this.suggestedCities = []; // Vider les suggestions si trop court
    }
  }

  // Fermer la liste des suggestions ville
  closeSuggestions(): void {
    this.suggestedCities = [];
  }

  // Appel API pour récupérer des suggestions de villes
  getCitySuggestions(query: string): void {
    const apiKey = '91f12b2c1fd04e25b590b5f5841d21ac'; // Clé API Geoapify
    const url = `/api/v1/geocode/autocomplete?text=${query}&lang=fr&apiKey=${apiKey}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.suggestedCities = response.features;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des suggestions de villes:', err);
      },
    });
  }

  // Lorsqu'une ville est sélectionnée dans la liste
  onCitySelect(city: any): void {
    this.formData.ville = city.properties.city || city.properties.name;
    this.formData.codePostal = city.properties.postcode || '';
    this.suggestedCities = []; // Fermer la liste des suggestions
  }

  // Vider l'input ville via bouton clear
  clearInput(event: MouseEvent): void {
    event.stopPropagation();
    this.formData.ville = '';
    this.suggestedCities = [];
  }

  // HostListener pour gérer la fermeture des suggestions quand on clique hors du champ ville
  // @HostListener('document:click', ['$event'])
  // onContainerClick(event: MouseEvent): void {
  //   if (this.inputVille != undefined)
  //     var clickedInside = this.inputVille.nativeElement.contains(event.target);
  //   if (!clickedInside) {
  //     this.suggestedCities = [];
  //   }
  // }

  // // HostListener similaire pour fermer suggestions rues
  // @HostListener('document:click', ['$event'])
  // onContainerClickStreet(event: MouseEvent): void {
  //   if (this.inputRue != undefined)
  //     var clickedInside = this.inputRue.nativeElement.contains(event.target);
  //   if (!clickedInside) {
  //     this.suggestedStreets = [];
  //   }
  // }

  @HostListener('document:click', ['$event'])
onContainerClick(event: MouseEvent): void {
  const clickedInside = this.inputVille?.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.suggestedCities = [];
  }
}

@HostListener('document:click', ['$event'])
onContainerClickStreet(event: MouseEvent): void {
  const clickedInside = this.inputRue?.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.suggestedStreets = [];
  }
}


  // Gestion de la saisie dans le champ rue pour autocomplétion
  onStreetInput(event: any): void {
    const query = event.target.value;
    if (query && query.length >= 3) {
      this.getStreetSuggestions(query);
    } else {
      this.suggestedStreets = [];
    }
  }

  // Appel API pour récupérer des suggestions de rues
  getStreetSuggestions(query: string): void {
    const apiKey = '91f12b2c1fd04e25b590b5f5841d21ac'; // Clé API Geoapify
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

  // Lorsqu'une rue est sélectionnée dans la liste, on met à jour rue, ville et code postal
  onStreetSelect(street: any): void {
    this.formData.rue = street.properties.street || street.properties.name;
    this.formData.ville = street.properties.city || street.properties.city_name;
    this.formData.codePostal = street.properties.postcode || 'Code Postal Inconnu';
    this.suggestedStreets = [];
  }

  // Vider les inputs via bouton clear
  clearStreetInput(event: any): void {
    event.stopPropagation();
    this.formData.rue = '';
    this.formData.ville = '';
    this.formData.codePostal = '';
    this.suggestedStreets = [];
  }
}
