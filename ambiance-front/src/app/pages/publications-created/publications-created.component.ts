import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../service/categories.service';
import { PublicationsService } from '../../service/publications.service';
import { Publication, Categorie } from '../../entity/publications';

@Component({
  selector: 'app-publications-created',
  templateUrl: './publications-created.component.html',
  styleUrls: ['./publications-created.component.scss'],
})
export class PublicationsCreatedComponent implements OnInit {
  // Liste complète des publications de l'utilisateur
  publications: Publication[] = [];

  // Liste filtrée selon les catégories sélectionnées et la plage de dates
  filteredPublications: Publication[] = [];

  // Sous-ensemble des publications affichées sur la page actuelle (pagination)
  paginatedPublications: Publication[] = [];

  // Liste de toutes les catégories disponibles
  categories: Categorie[] = [];

  // Ensemble des IDs de catégories sélectionnées pour filtrer
  selectedCategories: Set<number> = new Set();

  // Plage de dates sélectionnée pour filtrer (deux dates : début et fin)
  rangeDates: Date[] | undefined;

  // Indique si les données sont en cours de chargement (affiche un loader par ex)
  isLoading = true;

  // État du dropdown (ouvert / fermé) pour la sélection des catégories
  dropdownOpen = false;

  // ID de l'utilisateur connecté, récupéré depuis la session
  userId: string = '';

  // Nombre d'éléments affichés par page (pagination)
  pageSize: number = 10;

  // Page actuellement affichée
  currentPage: number = 1;

  // Nombre total de pages calculé après filtrage
  totalPages: number = 0;

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    // Récupération de l'ID utilisateur depuis sessionStorage pour filtrer ses publications
    this.userId = sessionStorage.getItem('id_utilisateur') ?? '';

    // Chargement des catégories depuis l'API
    this.loadCategories();

    // Chargement des publications de l'utilisateur
    this.loadPublications();
  }

  /**
   * Charge toutes les catégories depuis le service CategoriesService
   */
  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  /**
   * Charge toutes les publications depuis le service PublicationsService,
   * puis filtre celles appartenant à l'utilisateur connecté
   */
  loadPublications(): void {
    this.isLoading = true;
    this.publicationsService.getAll().subscribe({
      next: (data) => {
        // Filtrage pour ne garder que les publications de l'utilisateur courant
        this.publications = data.filter((pub: { idUtilisateur: string; }) => pub.idUtilisateur == this.userId);

        // Réinitialisation des filtres de catégories sélectionnées
        this.selectedCategories.clear();

        // Application des filtres (catégories, dates)
        this.applyFilters();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement publications :', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Ajoute ou retire une catégorie dans le filtre des catégories sélectionnées,
   * puis applique les filtres sur les publications
   * @param category ID de la catégorie à toggler
   */
  toggleCategoryFilter(category: number): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }

    // Remise à la première page à chaque changement de filtre
    this.currentPage = 1;

    // Re-filtrage des publications
    this.applyFilters();
  }

  /**
   * Applique les filtres de catégories et de plage de dates aux publications
   * et calcule le nombre total de pages pour la pagination
   */
  applyFilters(): void {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    // Récupère les dates de début et fin si définies
    if (this.rangeDates?.length === 2) {
      [startDate, endDate] = this.rangeDates;
    }

    // Filtrage selon catégorie et date
    this.filteredPublications = this.publications.filter(pub => {
      // Vérifie que la publication correspond à au moins une catégorie sélectionnée (ou aucune catégorie sélectionnée)
      const matchesCategory =
        this.selectedCategories.size === 0 ||
        pub.categories?.some(cat => this.selectedCategories.has(cat.id));

      // Vérifie que la date de la publication est dans la plage sélectionnée
      let matchesDate = true;
      if (startDate && endDate) {
        const eventDate = new Date(pub.dateEvenement);
        matchesDate = eventDate >= startDate && eventDate <= endDate;
      }

      return matchesCategory && matchesDate;
    });

    // Calcul du nombre total de pages après filtrage
    this.totalPages = Math.ceil(this.filteredPublications.length / this.pageSize);

    // Reset de la page courante à 1 après filtrage
    this.currentPage = 1;

    // Met à jour la liste des publications à afficher sur la page actuelle
    this.updatePageData();
  }

  /**
   * Met à jour la liste paginée en fonction de la page courante et du nombre
   * d'éléments par page
   */
  updatePageData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPublications = this.filteredPublications.slice(startIndex, endIndex);
  }

  /**
   * Navigue vers la page précédente si possible et met à jour la pagination
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageData();
    }
  }

  /**
   * Navigue vers la page suivante si possible et met à jour la pagination
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageData();
    }
  }

  /**
   * Navigue vers une page spécifique (si valide) et met à jour la pagination
   * @param page numéro de la page demandée
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageData();
    }
  }

  /**
   * Réinitialise tous les filtres (dates, catégories) et remet la pagination à 1
   */
  resetFilters(): void {
    this.rangeDates = undefined;
    this.selectedCategories.clear();
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Ouvre ou ferme le dropdown pour la sélection des catégories
   */
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Renvoie un label à afficher dans le dropdown en fonction des catégories sélectionnées
   */
  get selectedCategoriesLabel(): string {
    const selected = this.categories.filter(cat => this.selectedCategories.has(cat.idCategorie));
    return selected.length ? selected.map(c => c.nom).join(', ') : 'Sélectionner des catégories';
  }
}
