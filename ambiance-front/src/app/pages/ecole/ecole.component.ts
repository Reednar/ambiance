import { Component, OnInit } from '@angular/core';
import { EcoleService } from '../../service/ecole.service';
import { Ecole } from '../../entity/ecole';

@Component({
  selector: 'app-ecole',
  templateUrl: './ecole.component.html',
  styleUrls: ['./ecole.component.scss']
})
export class EcoleComponent implements OnInit {
  ecoles: Ecole[] = [];

  constructor(
    private ecoleService: EcoleService
  ) { }


  ngOnInit(): void {
    this.loadEcoles();
  }
  // Récupérer les écoles
  loadEcoles(): Promise<void> {
    return new Promise((resolve, reject) => {
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
