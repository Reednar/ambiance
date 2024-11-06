import { TestBed } from '@angular/core/testing';

import { TestService } from './test.service';
import { HttpClientModule } from '@angular/common/http';

describe('TestService', () => {
  let service: TestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(TestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
