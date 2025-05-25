import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { GroupsService } from '../../service/groups.service';
import { PublicationsService } from '../../service/publications.service';
import { Publication } from '../../entity/publications';
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

  constructor(private publicationsService: PublicationsService, private groupsService: GroupsService) { }

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
}
