namespace PokerTimer.Api.Exceptions
{
    public enum ErrorCode
    {
        CantSignUp,
        CantSignIn,
        Unknown,
        IdentityError,
        InvalidRefreshToken,
        ValidationError,
        NoPermissions,
        NotFound
    }
}