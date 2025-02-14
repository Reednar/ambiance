import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationsCreatedComponent } from '../publications-created/publicationsCreated.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [PublicationsCreatedComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule,
    ButtonModule,
    TagModule,
    RouterModule.forChild([
      { path: '', component: PublicationsCreatedComponent }
    ])
  ]
})
export class PublicationsCreatedModule { }