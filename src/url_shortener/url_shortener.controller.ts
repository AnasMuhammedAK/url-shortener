import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Res,
} from '@nestjs/common';
import { UrlShortenerService } from './url_shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url_shortener.dto';
import { Response } from 'express';

@Controller('short-url')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  //========================| create new short url |========================
  @Post()
  create(@Body() createUrlShortenerDto: CreateUrlShortenerDto) {
    return this.urlShortenerService.generateNewUrl(createUrlShortenerDto);
  }

  //========================| redirected to original url |========================
  @Get(':id')
  async handleRedirect(@Param('id') id: string, @Res() res: Response) {
    const originalURL = await this.urlShortenerService.findOriginalUrl(id);
    return res.redirect(301, originalURL);
  }

  @Get('analytics/:id')
  async getAnalytics(@Param('id') id: string) {
    return await this.urlShortenerService.getAnalytics(id);
  }

  @Get()
  findAll() {
    return this.urlShortenerService.findAll();
  }
}
