  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-basic-informations',
    templateUrl: './basic-informations.component.html',
    styleUrls: ['./basic-informations.component.scss']
  })
  export class BasicInformationsComponent implements OnInit, OnDestroy {
    categoriesOptions = [
      { label: 'Sport', value: 'Sport' },
      { label: 'Musique', value: 'Musique' },
      { label: 'Voyage', value: 'Voyage' },
      { label: 'Tech', value: 'Tech' }
    ];
    
    titre: string = "";
    date: Date = new Date();
    nbPersonnes: number = 0;
    prix: number = 0;
    description: string = "";
    categories: string[] = [];
    submitted: boolean = false;

    constructor(private router: Router) {}

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    nextPage() {
      // if(this.titre && this.date && this.nbPersonnes && this.prix && this.description && this.categories.length > 0)
      {
        this.router.navigate(['publicationsCreate/locationInformations']);
        return;
      }
      this.submitted = true;
    }

    // prevPage() {
    //   this.router.navigate(['create/selectStation']);
    // }

  }
