import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    FullCalendarModule,
    RouterModule.forChild([
      { path: '', component: CalendarComponent }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalendarPageModule { }