import { Component } from '@angular/core';
import { TestService } from './service/test/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ambiance-front';
  data = {};
  
  constructor (private testService: TestService) {}

  ngOnInit(): void {
    this.testService.getData().subscribe(
      (response) => {
        this.data = response;
        console.log('Data received: ', this.data);
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    )
  }
}
