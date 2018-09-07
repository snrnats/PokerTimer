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

        public string AccessToken { get; set; }

        public string TokenType { get; set; }

        public long Expires { get; set; }

        public string RefreshToken { get; set; }
        public string UserId { get; set; }
    }
}