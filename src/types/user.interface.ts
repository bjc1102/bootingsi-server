export default interface UserAuthInterface {
  provider: 'google';
  providerId: string;
  name: string;
  imageUrl: string;
  email: string;
}

export type UserDetails = {
  provider: 'google';
  providerId: any;
  name: string;
  email: string;
  imageUrl: string;
  refreshToken: string;

  // provider: 'google',
  // providerId: id,
  // name: displayName,
  // email: emails[0].value,
};
