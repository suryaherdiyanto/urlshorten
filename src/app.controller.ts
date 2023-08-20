import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, NotFoundException, Param, Post, Render, Req, Res, Session, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCsrfToken } from './decorators/csrf.decorator';
import { Reflector } from '@nestjs/core';
import { RedirectsService } from './redirects/redirects.service';
import { CreateRedirectDto } from './redirects/dto/create-redirect.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FlashMessage } from './decorators/flash-message.decorator';
import { CheckHitDTO } from './redirects/dto/check-hit.dto';
import { extractReferrerFromURL } from './str.utils';
import { ValidationExceptionFilter } from './validation-exception.filter';

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
  getHello(@Req() request: Request): object {
    const message = {
      data: request.flash('data'),
      success: request.flash('success')
    };
    const errors = request.flash('errors') ?? {};

    return { hello: this.appService.getHello(), message, errors, csrf: this.reflector.get<string>('csrf', this.getHello)};
  }

  @Post('/')
  @UseFilters(ValidationExceptionFilter)
  async shortenUrl(@Body() data: CreateRedirectDto, @Req() req: Request, @Res() res: Response) {
    const { referrer } = await this.redirectService.create(data.full_url);
    req.flash('success',  'Successfully create a shortern URL');
    req.flash('data',  `Here is your shorten URL:\n${this.config.get<string>('APP_URL')}/s/${referrer}`);

    res.redirect('/');
  }

  @Get('/s/:referrer')
  async hitReferrer(@Param('referrer') referrer: string, @Res() res: Response) {
    await this.redirectService.hitReferrer(referrer);
    const { full_url } = await this.redirectService.findByReferrer(referrer);

    res.redirect(full_url);
  }

  @Get('/check-hits')
  @Render('check-hits')
  @CreateCsrfToken()
  showCheckHitsForm() {
    return { csrf: this.reflector.get<string>('csrf', this.showCheckHitsForm)};
  }

  @Post('/check-hits')
  @HttpCode(200)
  async getTotalHits(@Body() data: CheckHitDTO) {

    if (!data.url.includes(this.config.get<string>('APP_URL'))) {
      throw new BadRequestException('Seems the URL not from our');
    }

    const referrer = extractReferrerFromURL(data.url);

    if (!referrer) {
      throw new NotFoundException('Referrer not found');
    }

    const redirect = await this.redirectService.findByReferrer(referrer);

    if (!redirect) {
      throw new NotFoundException('The referrer could not be founded');
    }

    return { data: redirect };
  }
}
