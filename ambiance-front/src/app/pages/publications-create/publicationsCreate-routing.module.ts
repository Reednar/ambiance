import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationInformationsComponent } from './location-informations/location-informations.component';
import { BasicInformationsComponent } from './basic-informations/basic-informations.component';
import { PublicationsCreateComponent } from './publicationsCreate.component';
import { HandicapInformationsComponent } from './handicap-informations/handicap-informations.component';

const routes: Routes = [
  { 
    path: '', 
    component: PublicationsCreateComponent, 
    children: [
      { path: '', redirectTo: 'basicInformations', pathMatch: 'full' }, // ✅ Redirection correcte
      { path: 'basicInformations', component: BasicInformationsComponent },
      { path: 'locationInformations', component: LocationInformationsComponent }, // ✅ Correction ici
      { path: 'handicapInformations', component: HandicapInformationsComponent }, // ✅ Correction ici
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationsCreateRoutingModule { }
