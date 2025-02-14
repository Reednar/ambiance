import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-handicap-informations',
  templateUrl: './handicap-informations.component.html',
  styleUrls: ['./handicap-informations.component.scss']
})
export class HandicapInformationsComponent implements OnInit {

  constructor(private router: Router) { }
  ascenseur: boolean = false;
  placeParking: boolean = false;
  rampe: boolean = false;
  
  ville: string = '';
  codePostal: number = 0;
  pays: string = '';

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.ville = navigation.extras.state['ville'] || '';
      this.codePostal = navigation.extras.state['codePostal'] || 0;
      this.pays = navigation.extras.state['pays'] || '';
    }
    console.log("Ville reçue:", this.ville);
  }

  prevPage() {
    this.router.navigate(['publicationsCreate/locationInformations']);
  }

  nextPage() {
    console.log("Options sélectionnées :", {
      ascenseur: this.ascenseur,
      placeParking: this.placeParking,
      rampe: this.rampe
    });
  
    this.router.navigate(['create/selectBorne']);
  }
  


}
