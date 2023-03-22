/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/database/User.entity';
import { UserDecorator } from 'src/utils/user.decorator';
import { SiteService } from './site.service';
import { ClipRequestBodyDto } from './dto/ClipRequestBody.dto';
import { UserService } from 'src/user/user.service';

// api/sites
@Controller('/sites')
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly userService: UserService,
  ) {}

  @Post('set/clip')
  // @UseGuards(AuthGuard('jwt'))
  async setOpenGraphClip(
    @UserDecorator() userInfo: User,
    @Body() requestBody: ClipRequestBodyDto,
  ) {
    const siteURL = requestBody.siteURL;
    const ogData = await this.siteService.fetchOpenGraphData(siteURL);
  }

  @Get('get/clips')
  @UseGuards(AuthGuard('jwt'))
  async getUserClipList(@UserDecorator() userInfo: User) {
    const { id, email } = userInfo;

    const clips = await this.siteService.getUserOpenGraphData(id, email);
    return clips;
  }

  @Post('set/extension/clip')
  async setExtensionClip(@Req() req: Request) {
    // //@ts-ignore
    // const { api_key, siteURL } = req.body;
    // try {
    //   if (!siteURL) throw new Error('url 정보가 없습니다.');
    //   // const { ogData } = await this.siteService.fetchOpenGraphData(siteURL);
    //   const user = await this.siteService.findUserByAPI_KEY(api_key);
    //   if (!user) throw new Error('유저가 없습니다. API 키를 다시 입력해주세요');
    //   const { ogTitle, ogImage, ogUrl } =
    //     await this.siteService.saveUserOpenGraphData(ogData, siteURL, user);
    //   return {
    //     ogTitle,
    //     ogImage,
    //     ogUrl,
    //   };
    // } catch (error) {
    //   throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    // }
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
