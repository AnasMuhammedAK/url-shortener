import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUrlShortenerDto } from './dto/create-url_shortener.dto';
import { UrlModel } from './interfaces/item.interface';
import { generate } from 'shortid';
import { ConfigService } from '@nestjs/config';
import { urlRegex } from 'utils/regex';
const config = new ConfigService();

@Injectable()
export class UrlShortenerService {
  constructor(@InjectModel('url') private urlModel: Model<UrlModel>) {}

  //========================| create new short url |========================
  async generateNewUrl(createUrlShortenerDto: CreateUrlShortenerDto) {
    const { url } = createUrlShortenerDto;
    //generate random string to create short url
    let randomId = generate();
    //1.check entered url is valid url
    const isUrl = url.match(urlRegex);
    if (!isUrl) throw new ForbiddenException('This is not a valid url');
    try {
      // 2.check entered url already exist
      const isUrlExist = await this.urlModel.findOne({ originalURL: url });
      if (isUrlExist) {
        const shortUrl = config.get('BASE_URL') + '/' + isUrlExist.shortId;
        return shortUrl;
      } else {
        //3.check shortId already exist
        //recursive function
        const isShortIdExist = async () => {
          const isExist = await this.urlModel.findOne({ shortId: randomId });
          if (isExist) {
            randomId = generate();
            //if exist call again function recursively
            isShortIdExist();
          } else {
            return;
          }
        };
        isShortIdExist();
        const createShortURL = new this.urlModel({
          shortId: randomId,
          originalURL: url,
          visitHistory: [],
        });
        await createShortURL.save();
        const shortUrl = config.get('BASE_URL') + '/' + randomId;
        return shortUrl;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOriginalUrl(id: string) {
    const data = await this.urlModel.findOneAndUpdate(
      { shortId: id },
      {
        $push: {
          visitHistory: {
            time: Date.now(),
          },
        },
      },
    );
    const { originalURL } = data;
    return originalURL;
  }

  //========================| find specific data |========================
  async getAnalytics(id: string) {
    //we can get from here total clicks and clicking time etc.
    return await this.urlModel.findOne({ shortId: id });
  }

  //========================| find all genarated urls |========================
  async findAll() {
    const data = await this.urlModel.find();
    const urls = data.map((item) => {
      return config.get('BASE_URL') + '/' + item.shortId;
    });
    return urls;
  }
}
