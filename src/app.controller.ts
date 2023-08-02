import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCsrfToken } from './decorators/csrf.decorator';
import { Reflector } from '@nestjs/core';
import { RedirectsService } from './redirects/redirects.service';
import { CreateRedirectDto } from './redirects/dto/create-redirect.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly reflector: Reflector, private readonly redirectService: RedirectsService) {}

  @Get()
  @Render('index')
  @CreateCsrfToken()
  getHello(): object {
    return { hello: this.appService.getHello(), csrf: this.reflector.get<string>('csrf', this.getHello)};
  }

  @Post('/')
  async shortenUrl(@Body() data: CreateRedirectDto, @Res() res: Response) {
    const { referrer } = await this.redirectService.create(data.full_url);
    console.log(referrer);

    res.redirect('/');
  }
}
