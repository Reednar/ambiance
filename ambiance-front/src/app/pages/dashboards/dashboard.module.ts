import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ChartModule,
    ButtonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent }
    ])
  ]
})
export class DashboardModule { }