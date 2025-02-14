import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

interface Claim {
  claim: string;
  value: unknown;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Ambiance';
  claims: Claim[] = [];
  username: string | undefined;
  role: string | undefined;
  roles: any;
  perimeter : any;
  constructor() {
  }

  async ngOnInit() {
  }

}