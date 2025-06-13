import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ColDef, ValueGetterParams } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { GroupsService } from '../../core/services/groups.service';
import { Publication } from '../../core/models/publications';
import { PublicationsService } from '../../core/services/publications.service';
import { User } from '../../core/models/users';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent implements OnInit, OnDestroy {
  posts: Publication[] = [];
  users: User[] = [];
  postCount: number = 0;
  userCount: number = 0;


  private destroy$ = new Subject<void>();
  selectedUser: User | any = { idUtilisateur: null, prenom: '', nom: '', pseudo: '', mail: '', telephone: '', role: '', groups: [] };
  newRole: string = '';
  selectedPost: Publication | any = null; // Add selectedPost property

  // Explicitly type parameters and fix injection issues
  constructor(
    private publicationsService: PublicationsService,
    private usersService: UsersService,
    private messageService: MessageService,
    private groupsService: GroupsService
  ) { }

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
        this.postCount = this.posts.length; // Mettre à jour le nombre de posts
      },
      error: (err) => console.error('Erreur lors de la récupération des posts:', err)
    });
  }

  // Récupérer les utilisateurs
  loadUsers(): void {
    // Filter out the logged-in user based on their session ID
    this.usersService.getUsers().subscribe(
      (data: any[]) => {
        // Ensure proper type handling for sessionStorage.getItem
        const loggedInUserId = sessionStorage.getItem('id_utilisateur');
        if (loggedInUserId) {
          this.users = data
            .filter(user => user.idUtilisateur !== parseInt(loggedInUserId, 10)) // Exclude the logged-in user
            .map(user => ({ ...user, groups: [] }));
          this.userCount = this.users.length;
        } else {
          console.error('Logged-in user ID not found in session storage.');
          this.users = data.map(user => ({ ...user, groups: [] }));
        }
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

  // Méthode pour supprimer un utilisateur
  onDelete(): void {
    if (this.selectedUser !== null) {
      this.usersService.deleteUser(this.selectedUser.idUtilisateur).subscribe({
        next: () => {
          if (this.selectedUser) {
            this.users = this.users.filter(user => user.idUtilisateur !== this.selectedUser.idUtilisateur);
          }
          this.selectedUser = null; // Reset the selected user after deletion
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

  // Méthode pour supprimer une publication
  deletePost(id: number): void {
    const loggedInUserId = sessionStorage.getItem('id_utilisateur')
    const data = {
      idPublication: id,
      utilisateurId: loggedInUserId ? parseInt(loggedInUserId, 10) : 0 // Ensure utilisateurId is a number
    };
    this.publicationsService.delete(data).subscribe(() => {
      this.posts = this.posts.filter(post => post.idPublication !== id);
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Publication supprimée avec succès.' });
      this.selectedPost = null; // Reset the selected post after deletion
    });
  }

  // Méthode pour créer un FormData à partir d'un utilisateur
  private createFormData(user: User): FormData {
    // Add debugging logs to verify the values being appended to FormData
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
    {
      field: 'role',
      headerName: 'Rôle',
      cellRenderer: (params: any) => {
        const selectElement = document.createElement('select');
        selectElement.className = 'form-select';

        const userOption = document.createElement('option');
        userOption.value = 'Utilisateur';
        userOption.textContent = 'Utilisateur';
        selectElement.appendChild(userOption);

        const adminOption = document.createElement('option');
        adminOption.value = 'Administrateur';
        adminOption.textContent = 'Administrateur';
        selectElement.appendChild(adminOption);

        // Store the original role in a separate property that cannot be modified
        if (!params.data.originalRole) {
          params.data.originalRole = params.data.role; // Save the original role only once
        }

        // Set the default value to the user's current role
        selectElement.value = params.data.role;

        selectElement.onchange = () => {
          const newRole = selectElement.value;
          params.data.roleChanged = newRole !== params.data.originalRole; // Compare with the saved original role
          params.data.role = newRole;
          params.api.redrawRows({ rowNodes: [params.node] });
        };

        return selectElement;
      }
    },
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
        deleteButton.onclick = () => this.setSelectedUser(params.data.idUtilisateur);
        element.appendChild(deleteButton);

        const applyButton = document.createElement('button');
        applyButton.textContent = 'Appliqué';
        applyButton.className = 'btn btn-sm btn-success';
        applyButton.style.display = params.data.roleChanged ? 'inline-block' : 'none';
        applyButton.onclick = () => this.onApplyRoleChange(params.data);
        element.appendChild(applyButton);

        return element;
      },
      cellRendererParams: {
        deleteUser: (userId: number) => this.setSelectedUser(userId),
        applyRoleChange: (user: User) => this.onApplyRoleChange(user)
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
      cellRenderer: (params: any) => {
        const element = document.createElement('div');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.className = 'btn btn-sm btn-danger';
        deleteButton.setAttribute('data-bs-toggle', 'modal');
        deleteButton.setAttribute('data-bs-target', '#deletePostModal');
        deleteButton.onclick = () => this.setSelectedPost(params.data.idPublication);
        element.appendChild(deleteButton);

        return element;
      }
    }
  ];

  // Modify setSelectedUser to fetch groups when a user is selected
  setSelectedUser(userId: number): void {
    const selectedUser = this.users.find(user => user.idUtilisateur === userId) || null;
    if (selectedUser) {
      this.selectedUser = selectedUser;
    } else {
      this.selectedUser = null;
      console.error(`Aucun utilisateur trouvé avec l'ID ${userId}.`);
    }
  }

  // Add setSelectedPost method to handle post selection
  setSelectedPost(postId: number): void {
    const selectedPost = this.posts.find(post => post.idPublication === postId) || null;
    if (selectedPost) {
      this.selectedPost = selectedPost;
    } else {
      this.selectedPost = null;
      console.error(`Aucune publication trouvée avec l'ID ${postId}.`);
    }
  }

  // Configuration par défaut des colonnes
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  // Supprimer un utilisateur sélectionné
  onDeleteUser(): void {
    if (this.selectedUser !== null && this.selectedUser) {

      this.usersService.deleteUser(this.selectedUser.idUtilisateur).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.idUtilisateur !== this.selectedUser.idUtilisateur);
          this.selectedUser = null;
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

  // Add a method to handle role change application
  onApplyRoleChange(user: User): void {
    // Implement the logic to apply the role change here
    const formData = new FormData();
    formData.append('role', user.role);
    this.usersService.updateUser(user.idUtilisateur, formData).subscribe({
      next: (updatedUser) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Rôle mis à jour avec succès.' });
        // Update the user in the local array
        const index = this.users.findIndex(u => u.idUtilisateur === updatedUser.idUtilisateur);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }

        // Mettre à jour le tableau
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du rôle:', err);
        const errorMessage = err?.error?.message || 'Une erreur est survenue lors de la mise à jour du rôle.';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: errorMessage });
      }
    });
  }
}