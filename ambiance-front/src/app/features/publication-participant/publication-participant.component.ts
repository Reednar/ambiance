import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicationsService } from '../../core/services/publications.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-publication-participant',
  templateUrl: './publication-participant.component.html',
  styleUrl: './publication-participant.component.css',
})
export class PublicationParticipantComponent {
  userId: string = ''; // Variable pour stocker l'ID utilisateur
  routeSub: any;
  participants: any[] = []; // Tableau pour stocker les participants

  constructor(
    private route: ActivatedRoute,
    private publicationsService: PublicationsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Initialisation logic can go here

    this.routeSub = this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadParticipantToEvent(id);
      }
    });

    // Récupération de l'ID utilisateur depuis sessionStorage pour filtrer ses publications
    this.userId = sessionStorage.getItem('id_utilisateur') ?? '';
  }

  ngOnDestroy() {
    // Nettoyage de la souscription pour éviter les fuites de mémoire
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadParticipantToEvent(id: number) {
    // Logique pour charger les participants à l'événement
    console.log(`Chargement des participants pour l'événement avec ID: ${id}`);
    // Ici, vous pouvez appeler un service pour récupérer les données des participants
    this.publicationsService.getParticipantsByPublicationId(id).subscribe({
      next: (participants: any[]) => {
        this.participants = participants;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les participants pour cet événement.',
        });
      },
    });
  }
}
