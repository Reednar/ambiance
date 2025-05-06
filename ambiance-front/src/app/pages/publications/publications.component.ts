import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  @ViewChild('dt1', { static: false }) dt1: any;

  publications: Publication[] = [];
  searchQuery: string = '';
  selectedCategory: string | null = null;
  selectedCategories: string[] = [];
  dateRange: Date[] = [];
  allPublications: any[] = []; // Ton tableau complet
  filteredPublications: any[] = []; // Publications filtrées

  fr: any;
  categories = [
    { label: 'Social', value: 'Social' },
    { label: 'Technology', value: 'Technology' }
  ];

    constructor(private publicationsService: PublicationsService) {}
  

  ngOnInit() {
    this.loadPublications();
  }

  filterPublications() {
  }

  onGlobalFilter(table: Table, event: Event){
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


filterByCategory(category: string): void {
  this.selectedCategory = category;
  // Ici tu filtres ta liste d'événements selon la catégorie
  console.log("Catégorie sélectionnée :", category);
}

rangeDates: Date[] | undefined;
isRange: boolean = true; // toggle si tu veux forcer le mode range ou pas

loadPublications(): void {
  this.publicationsService.getAll().subscribe({
    next: (data) => {
      this.publications = data;
      this.publications.forEach(element => {
      });
    },
    error: (err) => {
      console.error('Erreur lors du chargement des publications :', err);
    }
  });
}
}