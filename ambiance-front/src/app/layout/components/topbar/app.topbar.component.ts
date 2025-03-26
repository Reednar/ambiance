import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../../service/app.layout.service";
import { AuthService } from '../../../service/authent.service'; // Assure-toi que AuthService est bien importé
import { Router } from '@angular/router'; // Assure-toi que Router est bien importé
import { OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.scss'

})
export class AppTopBarComponent implements OnInit, OnChanges {

  items!: MenuItem[];
  menuItems: any[] = [];
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;
  currentUrl: string;
  textUrl!: string;
  isConnected: any;

  constructor(private authService: AuthService, private router: Router, public layoutService: LayoutService, private cdr: ChangeDetectorRef) {
    this.currentUrl = window.location.href; // Récupère l'URL actuelle
    if (this.currentUrl.includes("localhost:4200")) {
      this.textUrl = "Local";
    }
    else if (this.currentUrl.includes("dev-alize-gmao-noprod")) {
      this.textUrl = "DevNoProd";
    }
    else if (this.currentUrl.includes("dev-alize-gmao.azurewebsites")) {
      this.textUrl = "Dev";
    }
    else {
      this.textUrl = "Prod";
    }
  }

  ngOnInit(): void {
    // Initialisation du menu selon l'état actuel
    this.isConnected = this.authService.isConnected$.subscribe((value) => {
      this.isConnected = value
    })

    this.cdr.markForCheck();  // Forcer Angular à vérifier les changements
    this.updateMenuItems();
  }

  ngOnChanges(): void {
    this.isConnected = this.authService.isConnected$.subscribe((value) => {
      this.isConnected = value
    })
    this.updateMenuItems();
  }

  ngAfterViewInit(): void {
    this.updateMenuItems();
    this.cdr.detectChanges();  // Force la détection des changements après la vue
  }

  // Fonction pour mettre à jour les éléments du menu en fonction de l'état de la connexion
  updateMenuItems(): void {
    console.log('Mise à jour des éléments du menu');
    if (this.authService.isLoggedIn()) {
      console.log('Utilisateur connecté');
      this.menuItems = [
        { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
      ];
    } else {
      console.log('Utilisateur non connecté');
      this.menuItems = [
        { label: 'Connexion', icon: 'pi pi-sign-in', routerLink: '/login' },
        { label: 'Inscription', icon: 'pi pi-user-plus', routerLink: '/register' }
      ];
    }


  }

  // Fonction de déconnexion
  logout(): void {
    this.authService.logout();  // Tu devras créer cette méthode dans ton AuthService pour supprimer le token
    this.updateMenuItems();  // Mettre à jour le menu après la déconnexion
    this.router.navigate(['/login']);  // Rediriger vers la page d'accueil après la déconnexion
  }

  loggedInMenuItems = [
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
  ];

  loggedOutMenuItems = [
    { label: 'Login', icon: 'pi pi-sign-in', routerLink: '/login' },
    { label: 'Register', icon: 'pi pi-user-plus', routerLink: '/register' }
  ];

}
