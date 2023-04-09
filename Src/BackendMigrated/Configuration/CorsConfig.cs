using System.ComponentModel.DataAnnotations;

namespace PokerTimer.Api.Configuration;

public record CorsConfig()
{
    [Required, MinLength(1)]
    public string[] AllowedOrigins { get; init; }
}