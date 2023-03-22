import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt.interface';
import UserAuthInterface from 'src/types/user.interface';
import { User } from 'src/database/User.entity';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2Sync } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(googleUser: UserAuthInterface) {
    //실제 유저를 찾아옴
    const user = await this.userService.findOneUser({
      email: googleUser.email,
    });

    if (user) {
      //구글이미지 업데이트
      return this.userService.updateUserProperties(
        { id: user.id, email: user.email },
        {
          imageUrl: googleUser.imageUrl,
        },
      );
    }

    const api_key = pbkdf2Sync(
      googleUser.email,
      this.configService.get('API_SECRET'),
      1,
      32,
      'sha512',
    ).toString('base64');

    const userInfo = {
      email: googleUser.email,
      Name: googleUser.name,
      imageUrl: googleUser.imageUrl,
      api_key,
    };

    return this.userService.createUser(userInfo);
  }

  getToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '2h',
      secret: this.configService.get('JWT_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '14d',
      secret: this.configService.get('JWT_SECRET'),
    });

    return { accessToken, refreshToken };
  }

  async findByRefreshToken(email: string, refresh_token: string) {
    const user = await this.userService.findOneUser({
      email,
      refresh_token,
    });

    return user;
  }

  async updateRefreshToken(user: User, refresh_token: string) {
    return await this.userService.updateUserProperties(
      { id: user.id, email: user.email },
      {
        refresh_token,
      },
    );
  }

  async findUser(id: number, email: string) {
    return await this.userService.findOneUser({ id, email });
  }
}
