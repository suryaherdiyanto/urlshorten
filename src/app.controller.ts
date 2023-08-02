import { Body, Controller, Get, Post, Render, Req, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCsrfToken } from './decorators/csrf.decorator';
import { Reflector } from '@nestjs/core';
import { RedirectsService } from './redirects/redirects.service';
import { CreateRedirectDto } from './redirects/dto/create-redirect.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FlashMessage } from './decorators/flash-message.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reflector: Reflector,
    private readonly redirectService: RedirectsService,
    private readonly config: ConfigService
    ) {}

  @Get()
  @Render('index')
  @CreateCsrfToken()
  getHello(@FlashMessage() flash: object): object {
    return { hello: this.appService.getHello(), flash, csrf: this.reflector.get<string>('csrf', this.getHello)};
  }

  @Post('/')
  async shortenUrl(@Body() data: CreateRedirectDto, @Session() session: any, @Res() res: Response) {
    const { referrer } = await this.redirectService.create(data.full_url);
    session.flash = {
      success: 'Successfully create a shortern URL',
      data: `Here is your shorten URL:\n${this.config.get<string>('APP_URL')}/s/${referrer}`,
    };

    res.redirect('/');
  }
}
