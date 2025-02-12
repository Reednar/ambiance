import { Component, ElementRef, Inject } from '@angular/core';
import { LayoutService } from "../../service/app.layout.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent {
    constructor(public layoutService: LayoutService, private router: Router, public el: ElementRef) { }
}

