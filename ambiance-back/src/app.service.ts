import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    var test = "Hello world ! ";
    return JSON.stringify(test);
  }
}
