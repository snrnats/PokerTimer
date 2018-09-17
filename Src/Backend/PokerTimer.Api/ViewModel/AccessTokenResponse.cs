using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace PokerTimer.Api.ViewModel
{
    public class AccessTokenResponse
    {
        public AccessTokenResponse(string accessToken, long expires, string refreshToken, string userId)
        {
            AccessToken = accessToken;
            Expires = expires;
            RefreshToken = refreshToken;
            UserId = userId;
            TokenType = JwtBearerDefaults.AuthenticationScheme;
        }

        public string AccessToken { get; }

        public string TokenType { get; }

        public long Expires { get; }

        public string RefreshToken { get; }

        public string UserId { get; }
    }
}