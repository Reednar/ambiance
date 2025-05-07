import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicationsCreateFormComponent } from './publications-create-form.component';

import { CheckboxModule } from 'primeng/checkbox'; // << bien importer ça
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    PublicationsCreateFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    MultiSelectModule,
    InputTextareaModule,
    CheckboxModule,  // << ici
    ButtonModule
  ],
  exports: [
    PublicationsCreateFormComponent
  ]
})
export class PublicationsCreateFormModule { }
