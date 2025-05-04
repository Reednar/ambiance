import { Component, AfterViewInit, OnInit } from '@angular/core';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})




export class HomeComponent implements AfterViewInit {
  navbarOpen = false;

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
