import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent ,
    children: [
      { path: 'dashboard-irve', loadChildren: () => import('../app/pages/home/home.module').then(m => m.HomeModule) },
      { path: '', loadChildren: () => import('../app/pages/home/home.module').then(m => m.HomeModule)},
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
