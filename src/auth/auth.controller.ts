/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from 'src/database/User.entity';
import { UserDecorator } from 'src/utils/user.decorator';
import { JwtPayload } from 'src/types/jwt.interface';
import { AuthService } from './auth.service';
import cookieCommonOptions from './static/cookie-option';
import UserAuthInterface from 'src/types/user.interface';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // /api/auth/google/login
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async handleRedirect(
    @Res() res: Response,
    @UserDecorator() userInfo: UserAuthInterface,
  ) {
    const user = await this.authService.validateUser(userInfo);

    //유저 정보로 jwt 토큰 생성하기
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken } = this.authService.getToken(payload);
    await this.authService.updateRefreshToken(user, refreshToken);

    res.cookie('access-token', accessToken, {
      ...cookieCommonOptions('token'),
    });
    res.cookie('refresh-token', refreshToken, {
      ...cookieCommonOptions('refresh-token'),
    });

    res.redirect(this.configService.get('DOMAIN'));
  }

  // api/auth/refresh
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @UserDecorator() userInfo: User,
  ) {
    const { refreshToken, email } = userInfo as JwtPayload;

    // refresh_token과 이메일을 활용해 user 검사
    const user = await this.authService.findByRefreshToken(email, refreshToken);
    // 새로운 token 발급
    const token = this.authService.getToken({ id: user.id, email: user.email });
    // refreshToken 업데이트
    await this.authService.updateRefreshToken(user, token.refreshToken);

    response.cookie('access-token', token.accessToken, {
      ...cookieCommonOptions('token'),
    });
    response.cookie('refresh-token', token.refreshToken, {
      ...cookieCommonOptions('refresh-token'),
    });

    response.redirect(this.configService.get('DOMAIN'));
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserData(@UserDecorator() userInfo: User) {
    const { email, id } = userInfo as JwtPayload;
    const {
      email: userEmail,
      imageUrl,
      Name: name,
    } = await this.authService.findUser(id, email);

    return { userEmail, imageUrl, name };
  }
}
