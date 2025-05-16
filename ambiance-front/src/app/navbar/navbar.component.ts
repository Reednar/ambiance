import {
  Component,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  HostListener
} from '@angular/core';
import Swiper from 'swiper';
import { MenuItem } from 'primeng/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AuthService } from '../service/authent.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from 'primeng/menu';
import { Publication } from '../entity/publications';
import { PublicationsService } from '../service/publications.service';
import { User } from '../entity/users';
import { Ecole } from '../entity/ecole';
import { UsersService } from '../service/users.service';
import { SearchEntry, SearchService } from '../service/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit, OnInit, OnDestroy {
  navbarOpen = false;
  items: MenuItem[] = [];
  isConnected = false;
  private authSubscription!: Subscription;
  publications: Publication[] = [];
  ecoles: Ecole[] = [];
  users: User[] = [];
  searchTerm = '';
  results: SearchEntry[] = [];
  showSearch = false;
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('menu') menu!: Menu;
  showResults: boolean = false;  // Variable pour contrôler l'affichage des résultats

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private publicationsService: PublicationsService,
    private usersService: UsersService,
    private searchService: SearchService,
    private eRef: ElementRef

  ) {}

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

// async ngOnInit() {
//   try {
//       this.authSubscription = this.authService.isConnected$.subscribe((value) => {
//       this.isConnected = value;
//       this.updateMenuItems();
//       this.cdr.detectChanges();
//     });
//     this.loadPublications();
//     this.loadUsers();
//     this.searchService.initialize(this.publications, this.users, this.ecoles);
//       } catch (error) {
//     console.error('Erreur lors du chargement des données', error);
//   }
//   }

async ngOnInit() {
  try {
    this.authSubscription = this.authService.isConnected$.subscribe((value) => {
    this.isConnected = value;
    this.updateMenuItems();
    this.cdr.detectChanges();
    });
    // Attendre que les données soient chargées avant de les passer à `initialize()`
    await this.loadPublications();
    await this.loadUsers();

    // Une fois que les données sont prêtes, initialiser le service de recherche
    this.searchService.initialize(this.publications, this.users, this.ecoles);

    console.log('Données initialisées pour la recherche');
  } catch (error) {
    console.error('Erreur lors du chargement des données', error);
  }
}


  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  toggleNavbar(): void {
    const nav = document.querySelector('.navbar-collapse');
    nav?.classList.toggle('show');
    this.navbarOpen = !this.navbarOpen;
  }

  updateMenuItems(): void {
    this.items = this.isConnected
      ? [
          {
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      : [
          {
            label: 'Connexion',
            icon: 'pi pi-sign-in',
            routerLink: '/login'
          },
          {
            label: 'Inscription',
            icon: 'pi pi-user-plus',
            routerLink: '/register'
          }
        ];
  }

logout(event?: Event): void {
  if (event) {
    event.preventDefault();
  }

  this.authService.logout().subscribe({
    next: () => {
      this.updateMenuItems();
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Erreur lors de la déconnexion:', err);
    }
  });
}


  // loadPublications(): void {
  //   this.publicationsService.getAll().subscribe({
  //     next: (data) => {
  //       this.publications = data;
  //     },
  //     error: (err) => {
  //       console.error('Erreur chargement publications :', err);
  //     }
  //   });
  // }

  // // Récupérer les utilisateurs
  // loadUsers(): void {
  //   this.usersService.getUsers().subscribe(
  //     (data) => this.users = data,
  //     (error) => console.error('Erreur lors de la récupération des utilisateurs', error)
  //   );
  // }

  // Récupérer les publications
loadPublications(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.publicationsService.getAll().subscribe({
      next: (data) => {
        this.publications = data;
        resolve();  // Résoudre la Promise une fois les données récupérées
      },
      error: (err) => {
        console.error('Erreur chargement publications :', err);
        reject(err);  // Rejeter la Promise en cas d'erreur
      }
    });
  });
}

// Récupérer les utilisateurs
loadUsers(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        resolve();  // Résoudre la Promise une fois les données récupérées
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
       resolve();  // Rejeter la Promise en cas d'erreur
      }
    });
  });
}


private searchTimeout: any;

// onSearch(): void {
//   clearTimeout(this.searchTimeout);

//   this.searchTimeout = setTimeout(() => {
//     this.results = this.searchService.search(this.searchTerm);
//   }, 200); // 200ms après la dernière touche
// }

// onSearch(): void {
//     console.log('Recherche déclenchée avec :', this.searchTerm);
//     this.results = this.searchService.search(this.searchTerm);
//     console.log('Résultats obtenus :', this.results.length);
//   }


//    onLinkClick(route: string) {
//     console.log('Navigation vers :', route);
//     this.router.navigate([route]).catch(error => {
//       console.error('Erreur de navigation :', error);
//     });
//      this.results = [];
//   }

//   // Clic en dehors de l'input pour cacher les résultats
//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     const clickedInside = (event.target as HTMLElement).closest('.search-container');
//     if (!clickedInside) {
//       this.showResults = false;  // Cache les résultats
//     }
//   }

//   // Lorsque l'utilisateur clique dans l'input, montre les résultats
//   onInputClick() {
//     this.showResults = true;
//     console.log(this.showResults)
//   }


 onSearch(): void {
    this.results = this.searchService.search(this.searchTerm);
    this.showResults = true;  // Montrer les résultats après la recherche
  }

  onLinkClick(route: string) {
    this.router.navigate([route]);
    this.showResults = false;  // Cache les résultats
  }

  onLinkClickNavbar() {
      this.navbarOpen = false;
  }

  // Clic en dehors de l'input pour cacher les résultats
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.search-bar-container');
    if (!clickedInside) {
      this.showResults = false;  // Cache les résultats si on clique en dehors
    }
  }

  // Lorsque l'utilisateur clique dans l'input, montre les résultats
  onInputClick(event: MouseEvent) {
    event.stopPropagation();  // Empêche la propagation du clic vers le document
    this.showResults = true;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    this.showResults = false;
    // Fermer le menu si clic en dehors du header et s'il est ouvert
    if (this.navbarOpen && !this.eRef.nativeElement.contains(target)) {
      this.navbarOpen = false;
    }
  }
}
