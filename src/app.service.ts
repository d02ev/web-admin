import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public helloWorld() {
    return {
      status: 200,
      message: 'The Backend Server Is Ready For Requests!',
    };
  }
}
