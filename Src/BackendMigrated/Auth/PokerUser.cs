using Microsoft.AspNetCore.Identity;

namespace PokerTimer.Api.Auth;

public class PokerUser : IdentityUser
{
    public PokerUser()
    {
    }

    public PokerUser(string userName) : base(userName)
    {
    }
    
}