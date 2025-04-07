import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('../app/pages/home/home.module').then(m => m.HomeModule)},
      { path: 'publications', loadChildren: () => import('../app/pages/publications/publications.module').then(m => m.PublicationsModule) },
      { path: 'publicationsCreate', loadChildren: () => import('./pages/publications-create/publications-create.module').then(m => m.PublicationsCreateModule) },
      { path: 'publicationsCreated', loadChildren: () => import('./pages/publications-created/publications-created.module').then(m => m.PublicationsCreatedModule) },
      { path: 'calendar', loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarPageModule) },
      { path: 'register', loadChildren: () => import('./pages/user/register/register.module').then(m => m.RegisterModule) },
      { path: 'login', loadChildren: () => import('./pages/user/login/login.module').then(m => m.LoginModule) },
      { path: 'dashboards', loadChildren: () => import('./pages/dashboards/dashboard.module').then(m => m.DashboardModule) },
      { path: 'moderation', loadChildren: () => import('./pages/moderation/moderation.module').then(m => m.ModerationModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', 
    anchorScrolling: 'enabled', 
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started');
      }
    });
  }
}
