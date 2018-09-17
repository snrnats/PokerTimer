using System.ComponentModel.DataAnnotations;

namespace PokerTimer.Api.ViewModel
{
    public class RefreshAccessTokenRequest
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string RefreshToken { get; set; }
    }
}