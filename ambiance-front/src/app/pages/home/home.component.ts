import { Component, AfterViewInit, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { Categorie, Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';
import { CategoriesService } from '../../service/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
  publications: Publication[] = [];
  sport: Categorie | undefined;
  musique: Categorie | undefined;
  cinema: Categorie | undefined;
  voyage: Categorie | undefined;

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadPublications();
    this.loadCategories();
  }

  loadPublications(): void {
    this.publicationsService.getAll().subscribe({
      next: (data) => {
        this.publications = data
          .sort((a: { dateCreation: string | number | Date; }, b: { dateCreation: string | number | Date; }) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
          .slice(0, 8);
      },
      error: (err) => {
        console.error('Erreur chargement publications :', err);
      }
    });
  }

  loadCategories(): void {
    this.categoriesService.findOneDto(4).subscribe({
      next: (data) => this.sport = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
    this.categoriesService.findOneDto(2).subscribe({
      next: (data) => this.musique = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
    this.categoriesService.findOneDto(6).subscribe({
      next: (data) => this.voyage = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
    this.categoriesService.findOneDto(5).subscribe({
      next: (data) => this.cinema = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  ngAfterViewInit(): void {
    new Swiper('.swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      effect: 'slide',
      speed: 800
    });
  }
}
