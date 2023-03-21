import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from 'src/database/Site.entity';
import { UserModule } from 'src/user/user.module';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [TypeOrmModule.forFeature([Site]), UserModule],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
