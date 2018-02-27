using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PokerTimer.Api
{
    public class AccountContext : IdentityDbContext
    {
        public AccountContext(DbContextOptions<AccountContext> options) : base(options)
        {
        }
    }
}