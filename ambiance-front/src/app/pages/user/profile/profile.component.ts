import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user = {
    profileImageUrl: 'assets/images/pdp.jpg',
    username: 'MonPseudo',
    firstName: 'Prénom',
    lastName: 'Nom',
    birthDate: '',
    city: 'Ville',
    school: 'École'
  };

  saveProfile() {
  }
}
