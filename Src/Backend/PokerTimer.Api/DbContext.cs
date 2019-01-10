using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PokerTimer.Api.Auth;
using PokerTimer.Api.Models.Tournament;

namespace PokerTimer.Api
{
    public class DbContext : IdentityDbContext<PokerUser>
    {
        public DbContext(DbContextOptions<DbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<PokerUser>().HasIndex(user => user.RefreshToken).IsUnique();
        }



        public DbSet<Tournament> Tournaments { get; set; }

        public DbSet<Setup> Setups { get; set; }
    }
}