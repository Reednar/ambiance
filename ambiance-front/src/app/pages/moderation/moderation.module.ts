import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationComponent } from './moderation.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ModerationComponent],
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ChartModule,
    ButtonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ModerationComponent }
    ])
  ]
})
export class ModerationModule { }