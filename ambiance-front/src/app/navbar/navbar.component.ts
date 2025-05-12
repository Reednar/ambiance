import {
  Component,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import Swiper from 'swiper';
import { MenuItem } from 'primeng/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AuthService } from '../service/authent.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit, OnInit, OnDestroy {
  navbarOpen = false;
  items: MenuItem[] = [];
  isConnected = false;
  private authSubscription!: Subscription;

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('menu') menu!: Menu;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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

  ngOnInit(): void {
    // ✅ Souscription propre
    this.authSubscription = this.authService.isConnected$.subscribe((value) => {
      this.isConnected = value;
      this.updateMenuItems();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  toggleNavbar(): void {
    const nav = document.querySelector('.navbar-collapse');
    nav?.classList.toggle('show');
    this.navbarOpen = !this.navbarOpen;
  }

  updateMenuItems(): void {
    this.items = this.isConnected
      ? [
          {
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      : [
          {
            label: 'Connexion',
            icon: 'pi pi-sign-in',
            routerLink: '/login'
          },
          {
            label: 'Inscription',
            icon: 'pi pi-user-plus',
            routerLink: '/register'
          }
        ];
  }

  logout(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
  
    this.authService.logout();
    this.updateMenuItems();
    this.router.navigate(['/login']);
  }
}
