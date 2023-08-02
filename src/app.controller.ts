import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCsrfToken } from './csrf/csrf.decorator';
import { Reflector } from '@nestjs/core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly reflector: Reflector) {}

  @Get()
  @Render('index')
  @CreateCsrfToken()
  getHello(): object {
    return { hello: this.appService.getHello(), csrf: this.reflector.get<string>('csrf', this.getHello)};
  }
}
