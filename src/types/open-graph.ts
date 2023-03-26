import { Site } from 'src/database';

export type OpenGraphType = Pick<
  Site,
  'ogTitle' | 'ogDescription' | 'favicon' | 'ogUrl' | 'ogImage'
>;
