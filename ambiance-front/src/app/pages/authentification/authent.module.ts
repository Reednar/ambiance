import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentComponent } from './authent.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';  // Ajouté ici


@NgModule({
  declarations: [AuthentComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    FormsModule,
    CheckboxModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: AuthentComponent }
    ])
  ]
})
export class AuthentModule { }  