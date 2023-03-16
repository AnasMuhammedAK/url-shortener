import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlSchema } from 'src/url_shortener/schemas/url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'url', schema: UrlSchema }]),
    // MongooseModule.forRoot('mongodb://localhost:27017/short-url'),
    MongooseModule.forRoot(
      'mongodb+srv://anasak:wd3a8QiPV6RyUDjO@url-shortener-db.ixa4e4z.mongodb.net/urlShortener?retryWrites=true&w=majority',
    ),
  ],
})
export class DbModule {
  constructor() {
    console.log('MongoDB is connected...');
  }
}
