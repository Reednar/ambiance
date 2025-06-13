import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table'; // Table PrimeNG pour les références via ViewChild
import { PublicationsService } from '../../core/services/publications.service'; // Service des publications
import { CategoriesService } from '../../core/services/categories.service'; // Service des catégories
import { ActivatedRoute } from '@angular/router'; // Pour lire les paramètres de l'URL
import { Publication, Categorie } from '../../core/models/publications'; // Modèle Publication
@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  // Référence à la table PrimeNG dans le template
  @ViewChild('dt1', { static: false }) dt1: Table | undefined;

  // Liste complète des publications
  publications: Publication[] = [];

  // Publications auxquelles l'utilisateur est inscrit
  publicationsJoined: Publication[] = [];

  // Publications filtrées affichées à l'utilisateur
  filteredPublications: Publication[] = [];

  // Liste des catégories disponibles
  categories: Categorie[] = [];

  // Catégories sélectionnées par l'utilisateur
  selectedCategories: Set<number> = new Set();

  // Pour le composant de sélection de dates (non utilisé ici, probablement dans le HTML)
  dateRange: Date[] = [];

  // Intervalle de dates sélectionné (pour filtrer les publications)
  rangeDates: Date[] | undefined;

  // Événements rejoints par l'utilisateur (via leur ID)
  userJoinedEvents: Set<number> = new Set();

  // Indique si les données sont en cours de chargement (pour le spinner ou autre)
  isLoading = true;

  // ID de l'utilisateur connecté
  userId: number = 0;

  // Liste des écoles accessibles à l'utilisateur
  accessibleSchools: { id: number; nom: string }[] = [];

  // Écoles sélectionnées par l'utilisateur pour le filtrage
  selectedSchools: Set<number> = new Set<number>();

  constructor(
    private publicationsService: PublicationsService, // Injection du service de publications
    private categoriesService: CategoriesService,     // Injection du service de catégories
    private route: ActivatedRoute                     // Pour lire les paramètres de l'URL
  ) {}

  ngOnInit(): void {
    // Récupération de l'ID utilisateur depuis le sessionStorage
    this.userId = Number(sessionStorage.getItem('id_utilisateur') ?? '');

    // Si l'utilisateur est connecté, on charge ses écoles accessibles
    if (this.userId) {
      this.loadEcoleAccessible(this.userId);
    }

    // Lecture des paramètres de l'URL (ex: ?category=3 ou ?ecole=2)
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategories.add(Number(params['category']));
      } else if (params['ecole']) {
        this.selectedSchools.add(Number(params['ecole']));
      }

      // Une fois les filtres extraits, on charge les données nécessaires
      this.loadCategories();
      this.loadPublications();
      this.loadPublicationsFromUser();
    });
  }

  // Charge les écoles accessibles à l'utilisateur
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

  // Récupère toutes les catégories de publication
  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  // Récupère toutes les publications (non filtrées au départ)
  loadPublications(): void {
    this.isLoading = true; // Affiche un loader pendant le chargement
    this.publicationsService.getAll().subscribe({
      next: (data) => {
        this.publications = data;
        this.filteredPublications = data; // Initialement, on affiche tout
        this.isLoading = false;
        this.applyFilters(); // Applique les éventuels filtres déjà présents
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

  this.filteredPublications = this.publications.filter(pub =>
    this.isMatchingCategory(pub) &&
    this.isMatchingDate(pub, startDate, endDate) &&
    this.isMatchingSchool(pub)
  );
}

private isMatchingCategory(pub: Publication): boolean {
  return (
    this.selectedCategories.size === 0 ||
    pub.categories?.some(cat => this.selectedCategories.has(cat.id))
  );
}

private isMatchingDate(pub: Publication, start?: Date, end?: Date): boolean {
  if (!start || !end) return true;

  const eventDate = new Date(pub.dateEvenement);
  return eventDate >= start && eventDate <= end;
}

private isMatchingSchool(pub: Publication): boolean {
  if (this.selectedSchools.size === 0) return true;
  if (!pub.idEcole) return false;

  return this.selectedSchools.has(pub.idEcole);
}

  // applyFilters(): void {
  //   let startDate: Date | undefined;
  //   let endDate: Date | undefined;
  //   if (this.rangeDates?.length === 2) {
  //     [startDate, endDate] = this.rangeDates;
  //   }


  //   this.filteredPublications = this.publications.filter(pub => {

  //     // Filtre catégories (existant)
  //     const matchesCategory =
  //       this.selectedCategories.size === 0 ||
  //       pub.categories?.some(cat => this.selectedCategories.has(cat.id));

  //     // Filtre dates (existant)
  //     let matchesDate = true;
  //     if (startDate && endDate) {
  //       const eventDate = new Date(pub.dateEvenement);
  //       matchesDate = eventDate >= startDate && eventDate <= endDate;
  //     }

  //     // Filtre écoles — on vérifie si pub.listeEcoleIds contient au moins une des écoles sélectionnées
  //     let matchesSchools = true;
  //     if (this.selectedSchools.size > 0) {
  //       if (!pub.idEcole) {
  //         matchesSchools = false; // exclure si pub.idEcole n'existe pas
  //       } else {
  //         matchesSchools = this.selectedSchools.has(pub.idEcole);
  //       }
  //     }
  //     return matchesCategory && matchesDate && matchesSchools;
  //   });
  // }

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

  // goToChat(eventId: number): void {
  //   // Rediriger l'utilisateur vers la page de chat de l'événement
  // }

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