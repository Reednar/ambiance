import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Categorie, Publication } from '../../core/models/publications';
import { PublicationsService } from '../../core/services/publications.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaiementsService } from '../../core/services/paiements.service';
import { AuthService } from '../../core/services/authent.service';
import { GroupsService } from '../../core/services/groups.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publication-show',
  templateUrl: './publication-show.component.html',
  styleUrls: ['./publication-show.component.scss'],
  providers: [MessageService]
})

export class PublicationShowComponent implements OnInit, OnDestroy {
  @ViewChild('dt1', { static: false }) dt1: any;
  isUserRegistered: boolean = false;
  userJoinEvent: boolean = false;
  publications: Publication[] = [];
  publication!: Publication;
  categories: Categorie[] = [];
  searchQuery: string = '';
  selectedCategory: string | null = null;
  selectedCategories: Set<number> = new Set();
  dateRange: Date[] = [];
  allPublications: any[] = [];
  filteredPublications: any[] = [];
  isLoading = true;
  fr: any;
  routeSub: any;
  isConnected: boolean = false;
  private authSubscription!: Subscription;

  constructor(
    private readonly messageService: MessageService,
    private readonly publicationsService: PublicationsService,
    private readonly categoriesService: CategoriesService,
    private readonly route: ActivatedRoute,
    private readonly paiementsService: PaiementsService,
    private readonly authService: AuthService,
    private readonly groupsService: GroupsService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Abonne-toi aux changements de l'ID de la route pour chaque navigation
    this.routeSub = this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    if (id) {
      this.loadOnePublication(id);
    }
  });

  this.authSubscription = this.authService.isConnected$.subscribe((value) => {
  this.isConnected = value;
if (value) {
          this.groupsService.hasJoined({
            idPublication: this.publication.idPublication,
            idUtilisateur: Number(sessionStorage.getItem('id_utilisateur') ?? '')
          }).subscribe({
            next: (res: any) => {
              this.userJoinEvent = res.hasJoined;
            },
            error: (err) => {
              console.error('Erreur vérification inscription :', err);
              this.userJoinEvent = false;
            }
          });
        }

  this.cdr.detectChanges();
});


    this.route.queryParams.subscribe(params => {
      if (params['messageShown'] === 'true') {
        setTimeout(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Publication',
            detail: 'La publication a bien été créée.',
            life: 10000
          });
        }, 100);
      }
      if (params['paymentStatus']) {
        //const paymentStatus = params['paymentStatus'];
        const sessionId = params['session_id'];
        if (sessionId) {
          this.paiementsService.getSessionStatus(sessionId).then((result) => {
            if (result.status === 'paid') {
              setTimeout(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Paiement',
                  detail: 'Votre paiement a été validé avec succès.',
                  life: 10000
                });
              }, 100);
              this.paiementsService.create(sessionId).subscribe({
                next: (data) => {
                  console.log('Justificatif de paiement enregistré :', data);
                  this.addUserToGroup(Number(sessionStorage.getItem('id_utilisateur') ?? ''), this.publication.idPublication);
                },
                error: (err) => {
                  console.error('Erreur lors de l\'enregistrement du justificatif de paiement :', err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de l\'enregistrement du justificatif de paiement.',
                    life: 5000
                  });
                }
              });
            } else if (result.status === 'unpaid' || result.status === 'no_payment_required') {
              setTimeout(() => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Paiement',
                  detail: 'Le paiement a échoué ou a été annulé.',
                  life: 10000
                });
              }, 100);
              this.paiementsService.create(sessionId).subscribe({
                next: (data) => {
                  console.log('Justificatif de paiement enregistré :', data);
                },
                error: (err) => {
                  console.error('Erreur lors de l\'enregistrement du justificatif de paiement :', err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de l\'enregistrement du justificatif de paiement.',
                    life: 5000
                  });
                }
              });
            }
          }).catch(() => {
            setTimeout(() => {
              this.messageService.add({
                severity: 'error',
                summary: 'Paiement',
                detail: 'Impossible de vérifier le statut du paiement.',
                life: 10000
              });
            }, 100);
          });
        }
      }
    });


  }

  ngOnDestroy() {
    // Libère l'abonnement pour éviter les fuites de mémoire
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  joinEvent() {
    // Logique pour inscrire l'utilisateur à l'événement
    this.userJoinEvent = true;
  }

  joinChat() {
    // Logique pour rejoindre le chat (peut-être ouvrir un chat en ligne)
  }

  viewChat() {
    // Logique pour afficher le chat de l'événement
  }

  leaveEvent() {
    // Logique pour quitter l'événement
    this.isUserRegistered = false;
    this.userJoinEvent = false;
  }

  checkout(publication: Publication): void {
    console.log('Démarrage du processus de paiement pour la publication :', publication);
    this.paiementsService.checkout(publication).subscribe({
      next: (data) => {
        console.log('URL de redirection Stripe :', data);
        window.location.href = data.url;
      },
      error: (err) => {
        console.error('Erreur lors du paiement :', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors du paiement.',
          life: 5000
        });
      }
    });
  }

  checkIfUserLoggedIn() {
    if (!this.isConnected) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Connexion requise',
        detail: 'Veuillez vous connecter pour rejoindre l\'événement.',
        life: 5000
      });
    }
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

loadOnePublication(idPublication: number): void {
  this.isLoading = true;

  // Ne plus refaire un appel à isAuthenticated ici !
  // Utilise directement this.isConnected

  this.publicationsService.getOne(idPublication).subscribe({
    next: (data) => {
      this.publication = data;
      this.isLoading = false;

      if (this.isConnected && this.publication) {
        const idUtilisateur = Number(sessionStorage.getItem('id_utilisateur') ?? '');
        if (idUtilisateur) {
          this.groupsService.hasJoined({
            idPublication: this.publication.idPublication,
            idUtilisateur: idUtilisateur
          }).subscribe({
            next: (res: any) => {
              this.userJoinEvent = res.hasJoined;
            },
            error: (err) => {
              console.error('Erreur vérification inscription :', err);
              this.userJoinEvent = false;
            }
          });
        }
      }
    },
    error: (err) => {
      console.error('Erreur chargement publications :', err);
      this.isLoading = false;
    }
  });
}


  addUserToGroup(idUtilisateur: number, idPublication: number): void {
    this.groupsService.addUserToGroup({ idPublication, idUtilisateur }).subscribe({
      next: () => {
        this.userJoinEvent = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Inscription',
          detail: 'Vous avez bien rejoint l’événement.',
          life: 5000
        });
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout au groupe :', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de l’inscription.',
          life: 5000
        });
      }
    });
  }

joinFreeEvent(): void {
  if (!this.isConnected) return;

  try {
    this.addUserToGroup(Number(sessionStorage.getItem('id_utilisateur') ?? ''), this.publication.idPublication);
    this.userJoinEvent = true;

  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue lors de l’inscription.',
      life: 5000
    });
  }
}


}