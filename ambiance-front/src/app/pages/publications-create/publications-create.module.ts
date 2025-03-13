import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Pour le ngModel
import { ToastModule } from 'primeng/toast'; // Pour les Toasts
import { StepsModule } from 'primeng/steps'; // Pour les étapes
import { InputTextModule } from 'primeng/inputtext'; // Pour pInputText
import { InputTextareaModule } from 'primeng/inputtextarea'; // Pour pInputTextarea
import { ButtonModule } from 'primeng/button'; // Pour les boutons pButton
import { DropdownModule } from 'primeng/dropdown'; // Pour p-dropdown
import { MultiSelectModule } from 'primeng/multiselect'; // Pour p-multiSelect
import { CheckboxModule } from 'primeng/checkbox'; // Pour p-checkbox
import { ReactiveFormsModule } from '@angular/forms';
import { PublicationsCreateComponent } from './publications-create.component'; // Importe ton composant ici
import { PublicationsCreateRoutingModule } from './publications-create-routing.module';
import { LocationInformationsComponent } from './location-informations/location-informations.component';
import { CalendarModule } from 'primeng/calendar';
import { BasicInformationsComponent } from './basic-informations/basic-informations.component';
import { HandicapInformationsComponent } from './handicap-informations/handicap-informations.component';
import { MessageService } from 'primeng/api'; 

@NgModule({
  declarations: [
    PublicationsCreateComponent,
    LocationInformationsComponent,
    HandicapInformationsComponent,
    BasicInformationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    ToastModule,
    StepsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    PublicationsCreateRoutingModule,
    RouterModule.forChild([
      { path: '', component: PublicationsCreateComponent }
    ])
  ],
  providers:[
    MessageService
  ]
})
export class PublicationsCreateModule { }