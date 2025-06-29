import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { GroupsService } from '../../core/services/groups.service';
import { PublicationsService } from '../../core/services/publications.service';
import { Publication } from '../../core/models/publications';
import { Router } from '@angular/router';
import Swiper from 'swiper';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendar: FullCalendarComponent | undefined;  // Référence du calendrier
  events = [
    { title: 'Concert de rock', date: '2025-07-20', id: 1 },
    { title: 'Mariage de Sophie et Julien', date: '2025-06-15', id: 1 },
    { title: 'Voyage en Italie', date: '2025-08-10', id: 1 }
  ];
  userId: number = 0;
  publications: Publication[] = [];
  publicationsPassees: Publication[] = [];
  publicationsAVenir: Publication[] = [];

  constructor(private publicationsService: PublicationsService, private groupsService: GroupsService, private router: Router) { }

  ngOnInit() {
    this.userId = Number(sessionStorage.getItem('id_utilisateur') ?? '');
    this.loadPublicationsFromUser();
  }

  loadPublicationsFromUser(): void {
    this.publicationsService.getPublicationsByUser(this.userId).subscribe({
      next: (data) => {
        this.publications = data;
        this.mapPublicationsToEvents();
        if (this.calendar) {
          // Réaffectation des événements à `calendarOptions`
          this.calendarOptions.events = this.events;
          this.calendar.getApi().render();
        }
        this.chargerPublications();
      },
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  chargerPublications(): void {
    const maintenant = new Date();

    // Convertir les dates en Date
    this.publicationsPassees = this.publications.filter(pub => {
      const pubDate = new Date(pub.dateEvenement);
      return pubDate < maintenant;
    });

    this.publicationsAVenir = this.publications.filter(pub => {
      const pubDate = new Date(pub.dateEvenement);
      return pubDate >= maintenant;
    });
  }

  mapPublicationsToEvents() {
    this.events = this.publications.map(pub => ({
      title: pub.titre,
      date: new Date(pub.dateEvenement).toISOString().split('T')[0],
      id: pub.idPublication
    }));
  }

  calendarOptions: any = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: this.events,
    locale: frLocale,
    buttonText: {
      today: 'Aujourd\'hui',
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    titleFormat: { year: 'numeric', month: 'long' },

    eventContent: function (arg: any) {
      const anchor = document.createElement('a');
      anchor.href = '/publication-show/ ' + encodeURIComponent(arg.event.id);
      anchor.innerText = arg.event.title;
      anchor.style.textDecoration = 'underline';
      anchor.style.color = 'blue';
      anchor.style.cursor = 'pointer';

      return { domNodes: [anchor] };
    }
  };

  // Méthode pour naviguer vers les détails de l'événement
  voirDetailsEvenement(idPublication: number): void {
    this.router.navigate(['/publication-show', idPublication]);
  }

  // Méthode pour naviguer vers le chat
  voirChat(): void {
    this.router.navigate(['/messagerie']);
  }

  // Méthode pour payer l'événement (à implémenter selon vos besoins)
  payerEvenement(idPublication: number): void {
    // Logique de paiement à implémenter
    console.log('Paiement pour l\'événement:', idPublication);
    // Vous pouvez rediriger vers une page de paiement ou ouvrir un modal
  }

  // Méthode pour poser une question sur l'événement
  poserQuestion(idPublication: number): void {
    // Logique pour poser une question - pourrait rediriger vers un formulaire ou modal
    console.log('Poser une question pour l\'événement:', idPublication);
    // Exemple : this.router.navigate(['/questions'], { queryParams: { eventId: idPublication } });
  }

  // Méthode pour voir les commentaires d'un événement passé
  voirCommentaires(idPublication: number): void {
    // Rediriger vers la page des détails de l'événement où les commentaires sont affichés
    this.router.navigate(['/publication-show', idPublication]);
  }

  // Méthode pour écrire un commentaire sur un événement passé
  ecrireCommentaire(idPublication: number): void {
    // Rediriger vers la page des détails avec focus sur le formulaire de commentaire
    this.router.navigate(['/publication-show', idPublication], { 
      fragment: 'commentaires' // Pour naviguer directement vers la section commentaires
    });
  }

  ngAfterViewInit(): void {
    new Swiper('.swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      effect: 'slide',
      speed: 800
    });
  }

  navigateToEventDetails(eventId: number): void {
    this.router.navigate(['/publication-show', eventId]);
  }

  navigateToChat(): void {
    this.router.navigate(['/chat']);
  }
}
