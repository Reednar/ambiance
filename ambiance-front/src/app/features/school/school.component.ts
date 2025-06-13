import { Component, OnInit } from '@angular/core';
import { EcoleService } from '../../core/services/ecole.service';
import { Ecole } from '../../core/models/ecole';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {
  ecoles: Ecole[] = [];

  constructor(
    private ecoleService: EcoleService
  ) { }


  ngOnInit(): void {
    this.loadEcoles();
  }
  // Récupérer les écoles
  loadEcoles(): Promise<void> {
    return new Promise((resolve) => {
      this.ecoleService.findAllSchools().subscribe({
        next: (data) => {
          this.ecoles = data;
          resolve(); 
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des écoles', err);
          resolve();
        }
      });
    });
  }
}
