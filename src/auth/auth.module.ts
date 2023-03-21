import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { User } from 'src/database/User.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './utils/TokenStrategy';
import { RtStrategy } from './utils/RTokenStrategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [GoogleStrategy, AtStrategy, RtStrategy, AuthService],
})
export class AuthModule {}
