import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent ,
    children: [
      { path: '', loadChildren: () => import('../app/pages/home/home.module').then(m => m.HomeModule)},
      { path: 'publications', loadChildren: () => import('../app/pages/publications/publications.module').then(m => m.PublicationsModule) },
      { 
        path: 'publicationsCreate', 
        loadChildren: () => import('./pages/publications-create/publications-create.module').then(m => m.PublicationsCreateModule) 
      },
      { path: 'publicationsCreated', loadChildren: () => import('./pages/publications-created/publications-created.module').then(m => m.PublicationsCreatedModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes ,
  { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
