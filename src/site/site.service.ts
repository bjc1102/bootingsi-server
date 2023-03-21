import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ogs from 'open-graph-scraper';
import { Site } from 'src/database/Site.entity';
import { User } from 'src/database/User.entity';
import replaceUndefined from 'src/utils/replaceUndefined';
import { Repository } from 'typeorm';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async fetchOpenGraphData(url: string) {
    const options = { url };

    return ogs(options)
      .then(async (data) => {
        const { result: ogData } = data;

        return { ogData };
      })
      .catch((data) => {
        return data;
      });
  }

  async saveUserOpenGraphData(
    ogData: ogs.SuccessResult['result'],
    siteURL: string,
    { id, email }: Partial<User>,
  ) {
    //중복 데이터 관리 -> 중복이 있으면 저장하지않고 단순히 데이터를 리턴한다.
    const { ogTitle, ogDescription, ogImage, favicon } = ogData;

    const ogResult = this.siteRepository.create({
      ogTitle: ogTitle ?? '',
      ogDescription: ogDescription ?? '',
      ogUrl: siteURL,
      ogImage: replaceUndefined(ogImage, 'url'),
      favicon: favicon ?? '',
      user: { id, email },
    });

    return this.siteRepository.save(ogResult).then((response) => {
      delete response.user;
      return response;
    });
  }

  async getUserOpenGraphData(id: number, email: string) {
    return await this.siteRepository.findBy({
      user: {
        id,
        email,
      },
    });
  }

  async findUserByAPI_KEY(API_KEY: string) {
    return await this.userRepository.findOneBy({ api_key: API_KEY });
  }

  async deleteClipData(id: number, { id: userId, email }: Partial<User>) {
    return await this.siteRepository.delete({
      id: id,
      user: {
        id: userId,
        email,
      },
    });
  }
}
