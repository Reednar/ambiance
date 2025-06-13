import { Component, AfterViewInit, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { Categorie, Publication } from '../../core/models/publications';
import { PublicationsService } from '../../core/services/publications.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/authent.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
  // Liste des publications à afficher
  publications: Publication[] = [];

  // Catégories spécifiques affichées sur la page d'accueil
  sport: Categorie | undefined;
  musique: Categorie | undefined;
  cinema: Categorie | undefined;
  voyage: Categorie | undefined;

  constructor(
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Chargement des publications et des catégories
    this.loadPublications();
    this.loadCategories();

    // Vérifie la présence d'un token dans l'URL pour valider un utilisateur
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.validateUser(token);
      }
    });
  }

  /**
   * Valide un utilisateur via un token passé dans l'URL
   */
  validateUser(token: string): void {
    this.usersService.validateUserWithToken(token).subscribe({
      next: () => {
        alert('Votre compte a été validé avec succès !');

        // Vérifie si l'utilisateur est authentifié après validation
        this.authService.isAuthenticated().subscribe(auth => {
          console.log('Utilisateur authentifié :', auth);
        });
      },
      error: (err) => {
        alert('Le lien de validation est invalide ou expiré.');
        console.error('Erreur lors de la validation utilisateur :', err);
      }
    });
  }

  /**
   * Récupère et trie les 8 publications les plus récentes
   */
  loadPublications(): void {
    this.publicationsService.getAll().subscribe({
      next: (data) => {
        this.publications = data
          .sort((a: { dateCreation: string | number | Date; }, b: { dateCreation: string | number | Date; }) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
          .slice(0, 8);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des publications :', err);
      }
    });
  }

  /**
   * Charge les catégories principales à afficher sur la page d'accueil
   */
  loadCategories(): void {
    this.categoriesService.findOneDto(4).subscribe({
      next: (data) => this.sport = data,
      error: (err) => console.error('Erreur chargement catégorie sport :', err)
    });

    this.categoriesService.findOneDto(2).subscribe({
      next: (data) => this.musique = data,
      error: (err) => console.error('Erreur chargement catégorie musique :', err)
    });

    this.categoriesService.findOneDto(6).subscribe({
      next: (data) => this.voyage = data,
      error: (err) => console.error('Erreur chargement catégorie voyage :', err)
    });

    this.categoriesService.findOneDto(5).subscribe({
      next: (data) => this.cinema = data,
      error: (err) => console.error('Erreur chargement catégorie cinéma :', err)
    });
  }

  /**
   * Initialise le carrousel Swiper après affichage de la vue
   */
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
