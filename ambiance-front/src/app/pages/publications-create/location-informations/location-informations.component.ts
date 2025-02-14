import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms'; // Ajout du FormsModule

@Component({
  selector: 'app-location-informations',
  templateUrl: './location-informations.component.html',
  styleUrls: ['./location-informations.component.scss'],
  providers: [MessageService]
})
export class LocationInformationsComponent implements OnInit, OnDestroy {

  ville: string = "";
  codePostal: number = 0;
  pays: string = "France";
  submitted: boolean = false;


  constructor(private router: Router, public messageService: MessageService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  prevPage() {
    this.router.navigate(['publicationsCreate/basicInformations']);

  }

  nextPage() {
    this.submitted = true;
  
    if (this.ville && this.codePostal > 0 && this.pays) {
      this.router.navigate(['publicationsCreate/handicapInformations'], {
        state: { ville: this.ville, codePostal: this.codePostal, pays: this.pays }
      });
    }
  }

}
