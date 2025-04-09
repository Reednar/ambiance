import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../../service/app.layout.service";
import { AuthService } from '../../../service/authent.service'; // Assure-toi que AuthService est bien importé
import { Router } from '@angular/router'; // Assure-toi que Router est bien importé
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.scss'

})
export class AppTopBarComponent implements OnInit {

  items: MenuItem[] | undefined;
  menuItems: any[] = [];
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;
  isConnected: any;

  constructor(private authService: AuthService, private router: Router, public layoutService: LayoutService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Initialisation du menu selon l'état actuel
    this.isConnected = this.authService.isConnected$.subscribe((value) => {
      this.isConnected = value; // Met à jour la valeur de isConnected
      this.updateMenuItems(); // Met à jour les éléments du menu en fonction de l'état de la connexion
    })

    this.cdr.markForCheck();  // Forcer Angular à vérifier les changements
  }

  // Fonction pour mettre à jour les éléments du menu en fonction de l'état de la connexion
  updateMenuItems(): void {
    if (this.isConnected) {
      this.items = [
        { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
      ];
    } else {
      this.items = [
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
}
