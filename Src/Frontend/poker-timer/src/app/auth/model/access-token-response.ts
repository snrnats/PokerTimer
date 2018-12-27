export interface AccessTokenResponse {
  accessToken: string;
  tokenType: string;
  expires: number;
  refreshToken: string;
  userId: string;
}
