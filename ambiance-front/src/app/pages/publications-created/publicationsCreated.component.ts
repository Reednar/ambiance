import { Component } from '@angular/core';

@Component({
  selector: 'app-publicationsCreated',
  templateUrl: './publicationsCreated.component.html',
  styleUrls: ['./publicationsCreated.component.scss']
})
export class PublicationsCreatedComponent { 


    publications = [
      {
        image: '/assets/images/products/s4.jpg',
        prix: 2,
        autheurAvatar: '/assets/images/products/s1.jpg',
        categories: ['Social', 'Technology'],
        titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        vus: 9125,
        ville: 3,
        codePostal: 78990,
        date: new Date('2025-12-01')
      },
      {
        image: '/assets/images/products/s5.jpg',
        prix: 2,
        autheurAvatar: '/assets/images/products/s5.jpg',
        categories: ['Social', 'Technology'],
        titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        vus: 9125,
        ville: 3,
        codePostal: 78990,
        date: new Date('2025-12-01')
      },
      {
        image: '/assets/images/products/s7.jpg',
        prix: 2,
        autheurAvatar: '/assets/images/products/s2.jpg',
        categories: ['Social', 'Technology'],
        titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        vus: 9125,
        ville: 3,
        codePostal: 78990,
        date: new Date('2025-12-01')
      },
      {
        image: '/assets/images/products/s4.jpg',
        prix: 2,
        autheurAvatar: '/assets/images/products/s3.jpg',
        categories: ['Social', 'Technology'],
        titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        vus: 9125,
        ville: 3,
        codePostal: 78990,
        date: new Date('2025-12-01')
      },
      {
        image: '/assets/images/products/s5.jpg',
        prix: 2,
        autheurAvatar: 'assets/avatar1.png',
        categories: ['Social', 'Technology'],
        titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        vus: 9125,
        ville: 3,
        codePostal: 78990,
        date: new Date('2025-12-01')
      },
      {
        image: '/assets/images/products/s7.jpg',
        prix: 2,
        autheurAvatar: 'assets/avatar1.png',
        categories: ['Social', 'Technology'],
        titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        vus: 9125,
        ville: 3,
        codePostal: 78990,
        date: new Date('2025-12-01')
      }
    ];

}