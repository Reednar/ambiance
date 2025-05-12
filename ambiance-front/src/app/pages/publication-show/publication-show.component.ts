import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Categorie, Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';
import { CategoriesService } from '../../service/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-publication-show',
  templateUrl: './publication-show.component.html',
  styleUrls: ['./publication-show.component.scss'],
  providers: [MessageService]
})

export class PublicationShowComponent implements OnInit {
  @ViewChild('dt1', { static: false }) dt1: any;
  isUserRegistered: boolean = false;
  publications: Publication[] = [];
  publication!: Publication;
  categories: Categorie[] = [];
  searchQuery: string = '';
  selectedCategory: string | null = null;
  selectedCategories: Set<number> = new Set();
  dateRange: Date[] = [];
  allPublications: any[] = [];
  filteredPublications: any[] = [];
  isLoading = true;
  fr: any;

  constructor(
    private messageService: MessageService,
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadOnePublication(id);
    }

    this.route.queryParams.subscribe(params => {
      if (params['messageShown'] === 'true') {
        setTimeout(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Publication',
            detail: 'La publication a bien été créée.',
            life: 10000
          });
        }, 100);
      }
    });
  }


  joinEvent() {
    // Logique pour inscrire l'utilisateur à l'événement
    this.isUserRegistered = true;
  }

  joinChat() {
    // Logique pour rejoindre le chat (peut-être ouvrir un chat en ligne)
  }

  viewChat() {
    // Logique pour afficher le chat de l'événement
  }

  leaveEvent() {
    // Logique pour quitter l'événement
    this.isUserRegistered = false;
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  loadOnePublication(idPublication: number): void {
    this.isLoading = true;
    this.publicationsService.getOne(idPublication).subscribe({
      next: (data) => {
        this.publication = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement publications :', err);
        this.isLoading = false;
      }
    });
  }

}