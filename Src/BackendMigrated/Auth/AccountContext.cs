using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PokerTimer.Api.Auth
{
    public class AccountContext : IdentityDbContext<PokerUser>
    {
        public AccountContext(DbContextOptions<AccountContext> options) : base(options)
        {
        }
    }
}