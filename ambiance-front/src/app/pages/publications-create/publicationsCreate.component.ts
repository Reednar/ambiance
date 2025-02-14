import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicationsCreate',
  templateUrl: './publicationsCreate.component.html',
  styleUrls: ['./publicationsCreate.component.scss']
})
export class PublicationsCreateComponent {
 
  items: MenuItem[] = [];
  activeIndex: number = 0;

  constructor(public messageService: MessageService, public router: Router) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Informations Basiques',
        routerLink: 'basicInformations'  // Pas besoin de répéter 'publicationsCreate'
      },
      {
        label: 'Location',
        routerLink: 'locationInformations'  // Pas besoin de répéter 'publicationsCreate'
      },
      {
        label: 'Handicap',
        routerLink: 'handicapInformations'
      },
      {
        label: 'Confirmation',
        routerLink: 'confirmation'
      }
    ];
  }
  
  onActiveIndexChange(index: number): void {
    this.activeIndex = index;
    const route = this.items[index].routerLink;
  
    // Naviguer vers la route correspondante sans ajouter 'publicationsCreate' à chaque fois
    this.router.navigate([`publicationsCreate/${route}`]);  // Ici, on ajoute 'publicationsCreate' une seule fois
  }
}  