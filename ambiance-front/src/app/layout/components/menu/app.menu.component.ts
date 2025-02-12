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
                                routerLink: ['/curatives'],
                            },
                            {
                              label: 'Vos publications',
                              icon: 'pi pi-fw pi-check-circle',
                              routerLink: ['/curatives-cloturees'],
                            },
                            
                            {
                              label: 'Créer une publication',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/create'],
                            }
                        ]
                    },

                    // { label: 'Utilisateur', icon: 'pi pi-fw pi-users', routerLink: ['/user'], isAccessible: await this.isUserAccessible(splittedRoles) },
                    { label: 'Historique des participations', icon: 'pi pi-history', routerLink: ['/stationHistory'], isAccessible: true },
                    { label: 'Messagerie', icon: 'pi pi-fw pi-money-bill', routerLink: ['/refund'], isAccessible: true },
                    { label: 'Calendrier', icon: 'pi pi-fw pi-briefcase', routerLink: ['/organisation'], isAccessible: true },
                    {
                      label: 'Administration',
                      icon: 'pi pi-fw pi-list',
                      items: [
                        { label: 'Dashboards', icon: 'pi pi-fw pi-cog', routerLink: ['/cpo-settings'], isAccessible: true },
                        { label: 'Modération', icon: 'pi pi-fw pi-cog', routerLink: ['/errors-code-incomplete'], isAccessible: true },
                      ],
                    },


                    // { label: 'Maps', icon: 'pi pi-fw pi-map', routerLink: ['/maps'], isAccessible: await this.isMapAccessible(splittedRoles) },
                ]
            },
        ];
    }
}
