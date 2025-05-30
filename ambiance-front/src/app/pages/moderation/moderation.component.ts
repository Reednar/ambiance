import { Component, OnInit, OnDestroy } from '@angular/core';
import { Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';
import { Subject } from 'rxjs';
import { ColDef, ValueGetterParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { GroupsService } from '../../service/groups.service';
import { UsersService } from '../../service/users.service';
import { User } from '../../entity/users';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent implements OnInit, OnDestroy {
  posts: Publication[] = [];
  users: User[] = [];
  postCountByDate: { [date: string]: number } = {};

  private destroy$ = new Subject<void>();
  selectedUser: User | null = null;
  newRole: string = '';
  userIdToDelete: number | null = null; // Property to store the ID of the user to delete

  // Explicitly type parameters and fix injection issues
  constructor(
    private publicationsService: PublicationsService,
    private usersService: UsersService,
    private messageService: MessageService,
    private groupsService: GroupsService
  ) {}

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
    this.publicationsService.getAll().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => console.error('Erreur lors de la récupération des posts:', err)
    });
  }

  // Récupérer les utilisateurs
  loadUsers(): void {
    this.usersService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data.map(user => ({ ...user, groups: [] }));
        this.users.forEach(user => {
          this.groupsService.getUserGroups(user.idUtilisateur).subscribe(
            (groups: { idGroupe: number; nomDuGroupe: string }[]) => {
              user.groups = groups;
              console.log(`Groupes pour l'utilisateur ${user.idUtilisateur}:`, groups);
            },
            (error: any) => console.error(`Erreur lors de la récupération des groupes pour l'utilisateur ${user.idUtilisateur}:`, error)
          );
        });
      },
      (error: any) => console.error('Erreur lors de la récupération des utilisateurs', error)
    );
  }

  // Supprimer un utilisateur
  deleteUser(id: number): void {
    this.usersService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.idUtilisateur !== id);
    });
  }

  // onUpdate(user: User): void {
  //   // Ici tu peux ouvrir un modal ou une autre logique pour la mise à jour
  // }

  // Méthode pour supprimer un utilisateur
  onDelete(): void {
    if (this.userIdToDelete !== null) {
      this.usersService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.idUtilisateur !== this.userIdToDelete);
          this.userIdToDelete = null; // Reset the property after deletion
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé avec succès.' });
        },
        error: (err: any) => {
          console.error('Erreur lors de la suppression de l’utilisateur:', err);
          const errorMessage = err?.error?.message || 'Une erreur est survenue lors de la suppression.';
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: errorMessage });
        }
      });
    } else {
      console.error('Aucun utilisateur sélectionné pour la suppression.');
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Aucun utilisateur sélectionné pour la suppression.' });
    }
  }

  // Méthode pour modifier un utilisateur
  onUpdate(user: User): void {
    console.log('Modifier utilisateur:', user);
    // Implémentez la logique de modification ici
  }

  // Méthode pour supprimer une publication
  deletePost(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      // this.PublicationsService.deletePost(id).subscribe(() => {
      //   this.posts = this.posts.filter(post => post.idPublication !== id);
      // });
    }
  }

  // Méthode pour créer un FormData à partir d'un utilisateur
  private createFormData(user: User): FormData {
    const formData = new FormData();
    formData.append('prenom', user.prenom);
    formData.append('nom', user.nom);
    formData.append('pseudo', user.pseudo);
    formData.append('mail', user.mail);
    formData.append('telephone', user.telephone);
    formData.append('role', user.role);
    return formData;
  }

  // Définitions des colonnes pour les utilisateurs
  userColumnDefs: ColDef<User>[] = [
    { field: 'idUtilisateur', headerName: 'ID' },
    { field: 'prenom', headerName: 'Prénom' },
    { field: 'nom', headerName: 'Nom' },
    { field: 'pseudo', headerName: 'Pseudo' },
    { field: 'mail', headerName: 'Email' },
    { field: 'telephone', headerName: 'Téléphone' },
    { field: 'groups', headerName: 'Groupes', valueGetter: (params: ValueGetterParams<User, any>) => {
        const groups = params.data?.groups;
        return groups && groups.length > 0 ? groups.map(group => group.nomDuGroupe).join(', ') : 'Aucun groupe';
      } },
    {
      field: 'role', headerName: 'Rôle', cellRenderer: (params: any) => `
      <select class="form-select" [(ngModel)]="params.data.role">
        <option value="USER">Utilisateur</option>
        <option value="ADMIN">Administrateur</option>
      </select>
    ` },
    {
      headerName: 'Actions',
      field: 'idUtilisateur',
      cellRenderer: (params: any) => {
        const element = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.className = 'btn btn-sm btn-danger';
        deleteButton.setAttribute('data-bs-toggle', 'modal');
        deleteButton.setAttribute('data-bs-target', '#deleteModal');
        deleteButton.onclick = () => this.setUserIdToDelete(params.data.idUtilisateur);
        element.appendChild(deleteButton);
        return element;
      },
      cellRendererParams: {
        deleteUser: (userId: number) => this.setUserIdToDelete(userId)
      }
    }
  ];

  // Définitions des colonnes pour les publications
  postColumnDefs: ColDef<Publication>[] = [
    { field: 'titre', headerName: 'Titre' },
    { field: 'utilisateur.prenom', headerName: 'Auteur', valueGetter: (params: ValueGetterParams<Publication, any>) => `${params.data?.utilisateur?.prenom ?? ''} ${params.data?.utilisateur?.nom ?? ''}` },
    { field: 'dateCreation', headerName: 'Date de création', valueFormatter: (params: { value: string | number | Date; }) => new Date(params.value).toLocaleDateString() },
    { field: 'typePost', headerName: 'Type' },
    { field: 'prix', headerName: 'Prix', valueFormatter: (params: { value: any; }) => `${params.value} €` },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => `
        <button class="btn btn-sm btn-primary">Modifier</button>
        <button class="btn btn-sm btn-danger">Supprimer</button>
      `
    }
  ];


  setUserIdToDelete(userId: number): void {
    console.log('ID de l’utilisateur à supprimer:', userId);
    this.userIdToDelete = userId; // Set the user ID to delete
  }

  // Configuration par défaut des colonnes
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };
}