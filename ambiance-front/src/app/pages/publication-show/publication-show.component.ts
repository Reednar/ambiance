import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { Categorie, Publication } from '../../entity/publications';
import { PublicationsService } from '../../service/publications.service';
import { CategoriesService } from '../../service/categories.service';
import { PaiementsService } from '../../service/paiements.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../service/authent.service';

@Component({
  selector: 'app-publication-show',
  templateUrl: './publication-show.component.html',
  styleUrls: ['./publication-show.component.scss'],
  providers: [MessageService]
})

export class PublicationShowComponent implements OnInit, OnDestroy {
  @ViewChild('dt1', { static: false }) dt1: any;
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

  constructor(
    private messageService: MessageService,
    private publicationsService: PublicationsService,
    private categoriesService: CategoriesService,
    private paiementsService: PaiementsService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadOnePublication(id);
      }
    });

    this.authService.isConnected$.subscribe(isConnected => {
      this.isConnected = isConnected;
    });

    this.route.queryParams.subscribe(params => {
      const paymentStatus = params['paymentStatus'];
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
    });
  }

  ngOnDestroy() {
    // Libère l'abonnement pour éviter les fuites de mémoire
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
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

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  loadOnePublication(idPublication: number): void {
    this.isLoading = true;
    this.publicationsService.getOne(idPublication).subscribe({
      next: (data) => {
        this.publication = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement publications :', err);
        this.isLoading = false;
      }
    });
  }

}