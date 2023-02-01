import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteModule } from './site/site.module';
import { User, Site } from './database';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: '127.0.0.1',
          username: 'root',
          port: Number(configService.get('DATABASE_PORT')),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [User, Site],
          synchronize: !(configService.get('NODE_ENV') === 'production'),
        };
      },
    }),
    SiteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
