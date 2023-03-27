import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ogs from 'open-graph-scraper';
import { Site } from 'src/database/Site.entity';
import { User } from 'src/database/User.entity';
import { OpenGraphType } from 'src/types/open-graph';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    private readonly userService: UserService,
  ) {}

  async fetchOpenGraphData(url: string): Promise<OpenGraphType> {
    const options = { url };

    try {
      const { result } = await ogs(options);

      const ogTitle = result.ogTitle?.trim() || '';
      const ogImage = result.ogImage['url'].toString() || '';
      const ogDescription = result.ogDescription?.trim() || '';

      return {
        ogUrl: url,
        ogTitle: ogTitle,
        ogImage: ogImage,
        favicon: result.favicon.startsWith('https://') && result.favicon,
        ogDescription: ogDescription,
      };
    } catch (error) {
      return {
        ogUrl: url,
        ogTitle: url,
        ogImage: '',
        favicon: '',
        ogDescription: '해당 도메인은 등록된 설정이 없습니다.',
      };
    }
  }

  async getUserInfoByApiKey(api_key: string) {
    return await this.userService.findOneUser({ api_key });
  }

  async saveUserOpenGraphData(
    ogData: OpenGraphType,
    userInfo: Pick<User, 'id' | 'email'>,
  ) {
    const OpenGraphObject = {
      ...ogData,
      user: {
        id: userInfo.id,
        email: userInfo.email,
      },
    };

    const createOgData = this.siteRepository.create(OpenGraphObject);
    const { user, id, ...OpenGraphEntityWithoutUserAndId } =
      await this.siteRepository.save(createOgData);

    return OpenGraphEntityWithoutUserAndId;
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
