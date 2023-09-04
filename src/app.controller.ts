import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get()
  public hello() {
    return this._appService.helloWorld();
  }
}
