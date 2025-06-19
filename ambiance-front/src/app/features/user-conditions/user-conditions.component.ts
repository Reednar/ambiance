import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-conditions',
  templateUrl: './user-conditions.component.html',
  styleUrl: './user-conditions.component.css'
})
export class UserConditionsComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Conditions d\'utilisation | Ambiance');
    this.metaService.updateTag({
      name: 'description',
      content: 'Consultez les conditions d\'utilisation du site Ambiance : respect, confidentialité, responsabilités et règles d\'utilisation de la plateforme.'
    });
  }
}