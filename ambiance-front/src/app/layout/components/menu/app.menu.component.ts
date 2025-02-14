import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private router: Router) { }

    async ngOnInit() {
        this.model = [
            {
                label: 'Accueil',
                items: [
                    { label: 'Page d\'accueil', icon: 'pi pi-fw pi-home', routerLink: ['/'], isAccessible: true },
                ]
            },
            {
                label: 'Menu',
                items: [
                    {
                        label: 'Publications',
                        icon: 'pi pi-fw pi-list',
                        items: [
                            {
                                label: 'Voir les publications',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/publications'],
                            },
                            {
                              label: 'Vos publications',
                              icon: 'pi pi-fw pi-check-circle',
                              routerLink: ['/publicationsCreated'],
                            },
                            
                            {
                              label: 'Créer une publication',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/publicationsCreate'],
                            }
                        ]
                    },

                    // { label: 'Utilisateur', icon: 'pi pi-fw pi-users', routerLink: ['/user'], isAccessible: await this.isUserAccessible(splittedRoles) },
                    { label: 'Historique des participations', icon: 'pi pi-history', routerLink: ['/event-history'], isAccessible: true },
                    { label: 'Messagerie', icon: 'pi pi-fw pi-money-bill', routerLink: ['/message'], isAccessible: true },
                    { label: 'Calendrier', icon: 'pi pi-fw pi-briefcase', routerLink: ['/calendar'], isAccessible: true },
                    {
                      label: 'Administration',
                      icon: 'pi pi-fw pi-list',
                      items: [
                        { label: 'Dashboards', icon: 'pi pi-fw pi-cog', routerLink: ['/dashboards'], isAccessible: true },
                        { label: 'Modération', icon: 'pi pi-fw pi-cog', routerLink: ['/moderation'], isAccessible: true },
                      ],
                    },


                    // { label: 'Maps', icon: 'pi pi-fw pi-map', routerLink: ['/maps'], isAccessible: await this.isMapAccessible(splittedRoles) },
                ]
            },
        ];
    }
}
