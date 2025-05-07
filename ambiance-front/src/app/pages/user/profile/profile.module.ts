import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';  // Ajouté ici
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    FormsModule,
    CheckboxModule,
    ReactiveFormsModule,
    InputTextModule,
    RouterModule.forChild([
      { path: '', component: ProfileComponent }
    ])
  ]
})
export class ProfileModule { }  