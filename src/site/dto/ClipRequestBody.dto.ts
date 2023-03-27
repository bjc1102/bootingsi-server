import { IsString, IsUrl } from 'class-validator';

export class ClipRequestBodyDto {
  @IsString()
  @IsUrl()
  siteURL: string;
}

export class ExtensionClipRequestBodyDto {
  @IsString()
  @IsUrl()
  ogUrl: string;

  @IsString()
  ogTitle: string;

  @IsString()
  @IsUrl()
  favicon: string;

  @IsString()
  api_key: string;
}
