using System.Security.Claims;

namespace PokerTimer.Api.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}