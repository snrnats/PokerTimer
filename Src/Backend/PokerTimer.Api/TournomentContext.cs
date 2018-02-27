using Microsoft.EntityFrameworkCore;
using PokerTimer.Api.Models.Tournament;

namespace PokerTimer.Api
{
    public class TournomentContext : DbContext
    {
        public TournomentContext(DbContextOptions<TournomentContext> options) : base(options)
        {
        }

        public DbSet<Tournament> Tournaments { get; set; }

        public DbSet<Setup> Setups { get; set; }
    }
}