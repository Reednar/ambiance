import { ChangeDetectorRef, Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './core/services/authent.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UsersService } from './core/services/users.service';

interface Claim {
  claim: string;
  value: unknown;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ambiance-front';
  claims: Claim[] = [];
  username: string | undefined;
  role: string | undefined;
  roles: any;
  perimeter: any;
  emailConfirmed: boolean = false;
  isConnected: boolean = false;
  private authSubscription!: Subscription;
  userId: string = "";

  constructor(private primengConfig: PrimeNGConfig, private authService: AuthService, public messageService: MessageService, private userService: UsersService, private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // L'appel déclenche la vérification/initialisation de l'authentification (effet de bord voulu)
    this.authService.isAuthenticated().subscribe();

    this.userId = sessionStorage.getItem('id_utilisateur') ?? '';
    //  On prend le userId et on regarde s'il est connecté et si son mail est confirmé
    try {
      this.authSubscription = this.authService.isConnected$.subscribe((value) => {
        this.isConnected = value;
        this.cdr.detectChanges();
      });

      this.authSubscription = this.authService.emailConfirmed$.subscribe((value) => {
        this.emailConfirmed = value;
        this.cdr.detectChanges();
      });

      //  Met les jours/mois/.. de primeng en français
      this.primengConfig.setTranslation({
        dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
        monthNames: [
          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ],
        monthNamesShort: [
          "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
          "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"
        ],
        today: 'Aujourd\'hui',
        clear: 'Effacer',
        dateFormat: 'dd/mm/yy',
        firstDayOfWeek: 1
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  }

  //  Permet de renvoyer le mail de confirmation à l'utilisateur
  resendConfirmationEmail(event: Event) {
    event.preventDefault();
    this.userService.resendConfirmationEmail(sessionStorage.getItem('id_utilisateur') ?? '').subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Mail de confirmation renvoyé !',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de l’envoi du mail',
        });
      },
    });
  }
}