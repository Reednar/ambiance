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
  publications: Publication[] = [];
  filteredPublications: Publication[] = [];
  paginatedPublications: Publication[] = [];
  categories: Categorie[] = [];
  selectedCategories: Set<number> = new Set();
  rangeDates: Date[] | undefined;
  isLoading = true;
  dropdownOpen = false;
  userId: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id_utilisateur') ?? '';
    this.loadCategories();
    this.loadPublications();
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
        this.publications = data.filter((pub: { idUtilisateur: string; }) => pub.idUtilisateur == this.userId);
        this.selectedCategories.clear();
        this.applyFilters(); // Appliquer filtres dès le début
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement publications :', err);
        this.isLoading = false;
      }
    });
  }

  toggleCategoryFilter(category: number): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.currentPage = 1;
    this.applyFilters();
  }

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

    this.totalPages = Math.ceil(this.filteredPublications.length / this.pageSize);
    this.currentPage = 1;
    this.updatePageData();
  }

  updatePageData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPublications = this.filteredPublications.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageData();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageData();
    }
  }

  resetFilters(): void {
    this.rangeDates = undefined;
    this.selectedCategories.clear();
    this.currentPage = 1;
    this.applyFilters();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  get selectedCategoriesLabel(): string {
    const selected = this.categories.filter(cat => this.selectedCategories.has(cat.idCategorie));
    return selected.length ? selected.map(c => c.nom).join(', ') : 'Sélectionner des catégories';
  }
}
