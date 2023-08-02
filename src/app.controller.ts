import { Body, Controller, Get, Post, Render, Req, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCsrfToken } from './decorators/csrf.decorator';
import { Reflector } from '@nestjs/core';
import { RedirectsService } from './redirects/redirects.service';
import { CreateRedirectDto } from './redirects/dto/create-redirect.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FlashMessage } from './decorators/flash-message.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly reflector: Reflector, private readonly redirectService: RedirectsService, private readonly config: ConfigService) {}

  @Get()
  @Render('index')
  @CreateCsrfToken()
  getHello(@FlashMessage('success') successMessage: string|null, @FlashMessage('data') data: string|null): object {
    return { hello: this.appService.getHello(), flash: { successMessage, data }, csrf: this.reflector.get<string>('csrf', this.getHello)};
  }

  @Post('/')
  async shortenUrl(@Body() data: CreateRedirectDto, @Session() session: any, @Res() res: Response) {
    const { referrer } = await this.redirectService.create(data.full_url);
    session.flash['success'] = 'Successfully create a shortern URL';
    session.flash['data'] = `Here is your shorten URL:\n${this.config.get<string>('APP_URL')}/s/${referrer}`;

    res.redirect('/');
  }
}
