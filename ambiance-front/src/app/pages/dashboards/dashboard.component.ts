import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy { 
  posts: Publication[] = [];
  postCountByDate: { [date: string]: number } = {};
  private destroy$ = new Subject<void>();

  constructor(private PublicationsService: PublicationsService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  ngOnDestroy(): void {
    // On détruit le subject pour se désabonner des observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchPosts(): void {
    this.PublicationsService.getAll().pipe(
      takeUntil(this.destroy$) // S'assure que l'observable est désabonné lors de la destruction du composant
    ).subscribe({
      next: (data) => {
        this.posts = data;
        this.countPostsByDate();
      },
      error: (err) => console.error('Erreur lors de la récupération des posts:', err)
    });
  }

  countDates: string[] = [];
  countValues: number[] = [];
  
  private countPostsByDate(): void {
    const countByDate = this.posts.reduce((acc: any, post) => {
      const date = post.dateCreation.toString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});  

    this.countDates = Object.keys(countByDate);
    this.countValues = Object.values(countByDate);
  }
  
  logToken() {
    // console.log(localStorage.getItem('access_token'));
    console.log(sessionStorage.getItem('access_token'));
  }
}
