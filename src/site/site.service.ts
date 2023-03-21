import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ogs from 'open-graph-scraper';
import { Site } from 'src/database/Site.entity';
import { User } from 'src/database/User.entity';
import OpenGraphType from 'src/types/open-graph';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    private readonly userService: UserService,
  ) {}

  async fetchOpenGraphData(url): Promise<OpenGraphType> {
    const options = { url };

    try {
      const { result } = await ogs(options);

      const ogTitle = result.ogTitle?.trim() || '';
      const ogImage = result.ogImageURL?.trim() || '';
      const ogDescription = result.ogDescription?.trim() || '';

      return {
        url: url,
        title: ogTitle,
        image: ogImage,
        favicon: result.favicon.startsWith('https://') && result.favicon,
        description: ogDescription,
      };
    } catch (error) {
      return {
        url: url,
        title: url,
        image: '',
        favicon: '',
        description: error.result.error,
      };
    }
  }

  async getUserOpenGraphData(id: number, email: string) {
    return await this.siteRepository.findBy({
      user: {
        id,
        email,
      },
    });
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
