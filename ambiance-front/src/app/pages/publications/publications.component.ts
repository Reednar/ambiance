import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';
import { CategoriesService } from '../../service/categories.service';
import { Categorie } from '../../entity/publications';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})

export class PublicationsComponent implements OnInit {
  @ViewChild('dt1', { static: false }) dt1: Table | undefined;
  publications: Publication[] = [];
  publicationsJoined: Publication[] = [];
  filteredPublications: Publication[] = [];
  categories: Categorie[] = [];
  selectedCategories: Set<number> = new Set();
  dateRange: Date[] = [];
  rangeDates: Date[] | undefined;
  userJoinedEvents: Set<number> = new Set();
  isLoading = true;
  userId: number = 0;
  accessibleSchools: { id: number; nom: string }[] = [];
  selectedSchools: Set<number> = new Set<number>();

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  this.userId = Number(sessionStorage.getItem('id_utilisateur') ?? '');
  if (this.userId) {
    this.loadEcoleAccessible(this.userId);
  }

  this.route.queryParams.subscribe(params => {
    if (params['category']) {
      this.selectedCategories.add(Number(params['category']));
    } else if (params['ecole']) {
      console.log("param ecole: " + Number(params['ecole']));
      this.selectedSchools.add(Number(params['ecole']));
    }

    // Maintenant que les filtres sont prêts, on peut charger les données
    this.loadCategories();
    this.loadPublications();
    this.loadPublicationsFromUser();
  });
}


  loadEcoleAccessible(userId: number): void {
    this.publicationsService.getAccessibleSchools(userId).subscribe({
      next: (schools) => {
        this.accessibleSchools = schools;
      },
      error: (err) => {
        console.error('Erreur récupération écoles accessibles :', err);
      }
    });
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  loadPublications(): void {
    this.isLoading = true;
    this.publicationsService.getAll().subscribe({
      next: (data) => {
        this.publications = data;
        this.filteredPublications = data;
        this.isLoading = false;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur chargement publications :', err);
        this.isLoading = false;
      }
    });
  }

  // Méthode pour gérer le filtrage des catégories
  toggleCategoryFilter(category: number): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.applyFilters();
  }

  toggleSchoolFilter(schoolId: number): void {
  if (this.selectedSchools.has(schoolId)) {
    this.selectedSchools.delete(schoolId);
  } else {
    this.selectedSchools.add(schoolId);
  }
  this.applyFilters();
}

  // Appliquer les filtres en fonction des catégories sélectionnées
applyFilters(): void {
  let startDate: Date | undefined;
  let endDate: Date | undefined;
  if (this.rangeDates?.length === 2) {
    [startDate, endDate] = this.rangeDates;
  }


  this.filteredPublications = this.publications.filter(pub => {

    // Filtre catégories (existant)
    const matchesCategory =
      this.selectedCategories.size === 0 ||
      pub.categories?.some(cat => this.selectedCategories.has(cat.id));

    // Filtre dates (existant)
    let matchesDate = true;
    if (startDate && endDate) {
      const eventDate = new Date(pub.dateEvenement);
      matchesDate = eventDate >= startDate && eventDate <= endDate;
    }

    // Filtre écoles — on vérifie si pub.listeEcoleIds contient au moins une des écoles sélectionnées
  let matchesSchools = true;
  if (this.selectedSchools.size > 0) {
    if (!pub.idEcole) {
      matchesSchools = false; // exclure si pub.idEcole n'existe pas
    } else {
      matchesSchools = this.selectedSchools.has(pub.idEcole);
    }
  }


    return matchesCategory && matchesDate && matchesSchools;
  });
}


  getSelectedCategories(): any[] {
    return this.categories.filter(cat => this.selectedCategories.has(cat.idCategorie));
  }

  getSelectedSchools(): any[] {
  return this.accessibleSchools.filter(school => this.selectedSchools.has(school.id));
}


  resetFilters() {
    this.rangeDates = undefined;
    this.selectedCategories.clear();
    this.filteredPublications = this.publications
  }

  // Vérifie si l'utilisateur est inscrit à un événement
  isUserJoined(eventId: number): boolean {
    return this.userJoinedEvents.has(eventId);
  }

  // Fonction pour rejoindre l'événement
  joinEvent(eventId: number): void {
    this.userJoinedEvents.add(eventId);
  }

  goToChat(eventId: number): void {
    // Rediriger l'utilisateur vers la page de chat de l'événement
  }

  hasJoined(postId: number): boolean {
    return this.publicationsJoined.some(post => post.idPublication === postId);
  }

  loadPublicationsFromUser(): void {
    this.publicationsService.getPublicationsByUser(this.userId).subscribe({
      next: (data) => {
        this.publicationsJoined = data;
      },
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }
}