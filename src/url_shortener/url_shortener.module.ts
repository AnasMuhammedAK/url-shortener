import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url_shortener.service';
import { UrlShortenerController } from './url_shortener.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlSchema } from './schemas/url.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'url', schema: UrlSchema }])],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
