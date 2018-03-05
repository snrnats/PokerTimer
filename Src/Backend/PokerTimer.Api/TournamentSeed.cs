using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using PokerTimer.Api.Models.Tournament;

namespace PokerTimer.Api
{
    public class TournamentSeed
    {
        public async Task SeedAsync(TournomentContext context, IServiceProvider services, object logger, object settings)
        {
            var user = new IdentityUser("a@a.aa") {Email = "a@a.aa"};
            var userManager = services.GetService<UserManager<IdentityUser>>();
            var creaing = await userManager.CreateAsync(user, "Abc123!");
            Debug.Assert(creaing.Succeeded);

            var setup = new Setup();
            setup.Title = "Test setup";
            setup.OwnerId = user.Id;
            setup.Levels = new List<Level>();

            var smallBlind = 10;
            for (var i = 0; i < 7; i++)
            {
                var level = new Level(i, smallBlind, smallBlind * 2, 0, TimeSpan.FromMinutes(20));
                smallBlind *= 2;
                setup.Levels.Add(level);
            }

            context.Add(setup);

            var tournament = new Tournament {Title = "Fisrt Tournament"};
            tournament.OwnerId = user.Id;
            tournament.SetupId = setup.Id;

            context.Add(tournament);

            await context.SaveChangesAsync();
        }
    }
}