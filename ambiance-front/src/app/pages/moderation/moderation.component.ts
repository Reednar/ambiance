import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../entity/publications';
import { PostsService } from '../../service/publications.service';
import { User } from '../../entity/users';
import { UsersService } from '../../service/users.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent implements OnInit, OnDestroy { 
  posts: Post[] = [];
  users: User[] = [];
  postCountByDate: { [date: string]: number } = {};
  private destroy$ = new Subject<void>();

  constructor(private postsService: PostsService, private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchPosts();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    // On détruit le subject pour se désabonner des observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Récupérer les posts
  fetchPosts(): void {
    this.postsService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => console.error('Erreur lors de la récupération des posts:', err)
    });
  }

  // Récupérer les utilisateurs
  loadUsers(): void {
    this.usersService.getUsers().subscribe(
      (data) => this.users = data,
      (error) => console.error('Erreur lors de la récupération des utilisateurs', error)
    );
  }

  // Supprimer un utilisateur
  deleteUser(id: number): void {
    this.usersService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.idUtilisateur !== id);
    });
  }
  
  onUpdate(user: User): void {
    console.log('Modifier utilisateur :', user);
    // Ici tu peux ouvrir un modal ou une autre logique pour la mise à jour
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.usersService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(user => user.idUtilisateur !== id);
      });
    }
  }
}
