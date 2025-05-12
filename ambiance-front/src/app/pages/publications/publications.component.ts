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

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('id_utilisateur') ?? '');
    this.loadCategories();
    this.loadPublications();
    this.loadPublicationsFromUser();

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategories.add(Number(params['category']));
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

  // Appliquer les filtres en fonction des catégories sélectionnées
  applyFilters(): void {
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (this.rangeDates?.length === 2) {
      [startDate, endDate] = this.rangeDates;
    }
    this.filteredPublications = this.publications.filter(pub => {
      const matchesCategory =
        this.selectedCategories.size === 0 ||
        pub.categories?.some(cat => this.selectedCategories.has(cat.id));
      let matchesDate = true;
      if (startDate && endDate) {
        const eventDate = new Date(pub.dateEvenement);
        matchesDate = eventDate >= startDate && eventDate <= endDate;
      }
      return matchesCategory && matchesDate;
    });
  }

  getSelectedCategories(): any[] {
    return this.categories.filter(cat => this.selectedCategories.has(cat.idCategorie));
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