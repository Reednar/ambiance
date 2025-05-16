import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './service/authent.service';
import { catchError, map } from 'rxjs';
interface Claim {
  claim: string;
  value: unknown;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ambiance-front';
  claims: Claim[] = [];
  username: string | undefined;
  role: string | undefined;
  roles: any;
  perimeter : any;
  constructor(private primengConfig: PrimeNGConfig, private authService: AuthService) {}

ngOnInit() {
  this.authService.isAuthenticated().subscribe(authenticated => {
    if (authenticated) {
    } else {
    }
  });

      this.primengConfig.setTranslation({
      dayNames: ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
      dayNamesShort: ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],
      dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
      monthNames: [
        "Janvier","Février","Mars","Avril","Mai","Juin",
        "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
      ],
      monthNamesShort: [
        "Jan","Fév","Mar","Avr","Mai","Jun",
        "Jul","Aoû","Sep","Oct","Nov","Déc"
      ],
      today: 'Aujourd\'hui',
      clear: 'Effacer',
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1
    });
  }
}