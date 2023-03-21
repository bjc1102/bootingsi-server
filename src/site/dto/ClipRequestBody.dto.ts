import { IsString, IsUrl } from 'class-validator';

export class ClipRequestBodyDto {
  @IsString()
  @IsUrl()
  siteURL: string;
}
