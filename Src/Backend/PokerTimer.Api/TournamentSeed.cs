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

            var guest = new IdentityUser("b@b.bb") { Email = "b@b.bb" };
            creaing = await userManager.CreateAsync(guest, "Abc123!");
            Debug.Assert(creaing.Succeeded);

            var setup = new Setup();
            setup.Title = "Test setup";
            setup.OwnerId = user.Id;
            setup.StartingChips = 2000;
            setup.NumberOfPlayers = 4;
            setup.Levels = new List<Level>();

            var smallBlind = 10;
            for (var i = 0; i < 7; i++)
            {
                var level = new Level(i, smallBlind, smallBlind * 2, 0, TimeSpan.FromMinutes(20));
                smallBlind *= 2;
                setup.Levels.Add(level);
            }

            context.Add(setup);


            var setup2 = new Setup();
            setup2.Title = "Fast setup";
            setup2.OwnerId = guest.Id;
            setup2.StartingChips = 3000;
            setup2.NumberOfPlayers = 6;
            setup2.Levels = new List<Level>();

            smallBlind = 10;
            var ante = 5;
            for (var i = 0; i < 7; i++)
            {
                var level = new Level(i, smallBlind, smallBlind * 2, ante+=5, TimeSpan.FromMinutes(15));
                smallBlind *= 3;
                setup2.Levels.Add(level);
            }

            context.Add(setup2);


            var setup3 = new Setup();
            setup3.Title = "Slow setup";
            setup3.OwnerId = user.Id;
            setup3.StartingChips = 5000;
            setup3.NumberOfPlayers = 5;
            setup3.Levels = new List<Level>();

            smallBlind = 5;
            for (var i = 0; i < 8; i++)
            {
                var level = new Level(i, smallBlind, smallBlind * 2, 0, TimeSpan.FromMinutes(25));
                smallBlind *= 2;
                setup3.Levels.Add(level);
            }

            context.Add(setup3);

            var tournament = new Tournament {Title = "Fisrt Tournament"};
            tournament.OwnerId = user.Id;
            tournament.SetupId = setup.Id;
            tournament.StartDate = DateTimeOffset.Now;

            context.Add(tournament);


            var tournament2 = new Tournament {Title = "Second Tournament"};
            tournament2.OwnerId = user.Id;
            tournament2.SetupId = setup2.Id;
            tournament2.StartDate = DateTimeOffset.Now.AddHours(1);

            context.Add(tournament2);
                        
            var tournament3 = new Tournament { Title = "Third Tournament" };
            tournament3.OwnerId = guest.Id;
            tournament3.SetupId = setup3.Id;
            tournament3.StartDate = DateTimeOffset.Now.AddHours(-1);

            context.Add(tournament3);

            await context.SaveChangesAsync();
        }
    }
}