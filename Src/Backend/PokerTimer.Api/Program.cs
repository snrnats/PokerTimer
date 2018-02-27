using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace PokerTimer.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args)
                .MigrateDbContext<TournomentContext>(((context, services) =>
                {
                    var logger = services.GetService(typeof(ILogger<TournomentContext>));
                    var settings = services.GetService(typeof(IConfiguration));
                    new TournamentSeed()
                        .SeedAsync(context, services, logger, settings)
                        .Wait();
                }))
                .Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
