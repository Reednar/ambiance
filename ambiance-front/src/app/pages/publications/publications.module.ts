import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationsComponent } from '../publications/publications.component';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [PublicationsComponent],
  imports: [
    CommonModule,
    DropdownModule,
    MultiSelectModule,
    FormsModule,
    InputTextModule,
    RouterModule.forChild([
      { path: '', component: PublicationsComponent }
    ])
  ]
})
export class PublicationsModule { }