import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr'; 
import Swiper from 'swiper';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {
  events = [
    { title: 'Concert de rock', date: '2025-07-20' },
    { title: 'Mariage de Sophie et Julien', date: '2025-06-15' },
    { title: 'Voyage en Italie', date: '2025-08-10' }
  ];

  constructor() {
    this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }


  
  calendarOptions: any = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: this.events,
    locale: frLocale, // Applique la locale française
    buttonText: {
      today: 'Aujourd\'hui',
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
    },
    // Utilisation de `dateFormat` pour personnaliser l'affichage du mois
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    // Vous pouvez personnaliser le format pour inclure une majuscule sur les mois ici
    titleFormat: { year: 'numeric', month: 'long' } // Affiche le mois en long avec une majuscule
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
