import { Component, OnInit } from '@angular/core';
import { TestService } from './service/test/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent implements OnInit { 
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
