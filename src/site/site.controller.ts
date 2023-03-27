/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/database/User.entity';
import { UserDecorator } from 'src/utils/user.decorator';
import { SiteService } from './site.service';
import {
  ClipRequestBodyDto,
  ExtensionClipRequestBodyDto,
} from './dto/ClipRequestBody.dto';
import { UserService } from 'src/user/user.service';
import UserAuthInterface from 'src/types/user.interface';

// api/sites
@Controller('/sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post('set/clip')
  @UseGuards(AuthGuard('jwt'))
  async setOpenGraphClip(
    @UserDecorator() userInfo: User,
    @Body() requestBody: ClipRequestBodyDto,
  ) {
    const siteURL = requestBody.siteURL;
    const ogData = await this.siteService.fetchOpenGraphData(siteURL);

    return await this.siteService.saveUserOpenGraphData(ogData, userInfo);
  }

  @Get('get/clips')
  @UseGuards(AuthGuard('jwt'))
  async getUserClipList(@UserDecorator() userInfo: User) {
    const { id, email } = userInfo;
    const clips = await this.siteService.getUserOpenGraphData(id, email);

    return clips;
  }

  @Post('set/extension/clip')
  async setExtensionClip(@Body() requestBody: ExtensionClipRequestBodyDto) {
    const { api_key, ...requestOgData } = requestBody;

    const { ogDescription, ogImage } =
      await this.siteService.fetchOpenGraphData(requestOgData.ogUrl);
    const userInfo = await this.siteService.getUserInfoByApiKey(api_key);

    return await this.siteService.saveUserOpenGraphData(
      { ...requestOgData, ogDescription, ogImage },
      userInfo,
    );
  }

  @Delete('delete/clip/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteUserClipData(
    @Param('id') clipId: number,
    @UserDecorator() userInfo: User,
  ) {
    const { id, email } = userInfo;

    try {
      await this.siteService.deleteClipData(clipId, { id, email });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
