export class AccessTokenResponse {
  accessToken: string;
  tokenType: string;
  expires: number;
  refreshToken: string;
  userId: string;

  get isFresh(): boolean {
    return this.expires > new Date().getTime() / 1000;
  }
}
