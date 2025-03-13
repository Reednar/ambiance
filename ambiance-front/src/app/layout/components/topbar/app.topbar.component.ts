import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../../service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    currentUrl: string;
    textUrl!: string;
    constructor(public layoutService: LayoutService) { 
        this.currentUrl = window.location.href; // Récupère l'URL actuelle
        if (this.currentUrl.includes("localhost:4200")) {
            this.textUrl = "Local";
        }
        else if (this.currentUrl.includes("dev-alize-gmao-noprod")) {
            this.textUrl = "DevNoProd";
        }
        else if (this.currentUrl.includes("dev-alize-gmao.azurewebsites")) {
            this.textUrl = "Dev";
        }
        else {
            this.textUrl = "Prod";
        }
    }

    menuItems = [
        { label: 'Connexion', icon: 'pi pi-sign-in', routerLink: '/login' },
        { label: 'Inscription', icon: 'pi pi-user-plus', routerLink: '/register' }
      ];
}
