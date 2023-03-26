import { IsString, IsUrl } from 'class-validator';

export class ClipRequestBodyDto {
  @IsString()
  @IsUrl()
  siteURL: string;
}

export class ExtensionClipRequestBodyDto {
  @IsString()
  @IsUrl()
  siteURL: string;

  @IsString()
  @IsUrl()
  favicon: string;

  @IsString()
  ogTitle: string;

  @IsString()
  ogDescription: string;
}
