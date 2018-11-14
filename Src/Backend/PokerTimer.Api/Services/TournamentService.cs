using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PokerTimer.Api.Exceptions;
using PokerTimer.Api.Extensions;
using PokerTimer.Api.Models.Tournament;

namespace PokerTimer.Api.Services
{
    public class TournamentService
    {
        private readonly TournomentContext _context;

        public TournamentService(TournomentContext context)
        {
            _context = context;
        }

        public async Task<Tournament> GetTournament(int id)
        {
            var tournament = await _context.Tournaments.Include(t => t.Setup).ThenInclude(s => s.Levels).SingleOrDefaultAsync(m => m.Id == id);
            if (tournament == null)
            {
                throw new NotFoundException($"There is no any tournament with id {id}");
            }

            tournament.Setup.Levels.Sort((x, y) => x.Index.CompareTo(y.Index));
            return tournament;
        }

        public async Task<ReadOnlyCollection<Tournament>> GetTournaments(string userId)
        {
            var tournaments = await _context.Tournaments.Where(tournament => tournament.OwnerId == userId).Include(t => t.Setup).ThenInclude(s => s.Levels).ToListAsync();
            foreach (var tournament in tournaments)
            {
                tournament.Setup.Levels.Sort((x, y) => x.Index.CompareTo(y.Index));
            }

            return tournaments.ToReadOnly();
        }

        public async Task UpdateTournament(Tournament tournament, string currentUserId)
        {
            var storedTournament = await _context.Tournaments.FindAsync(tournament.Id);

            if (storedTournament.OwnerId != currentUserId)
            {
                throw new NoPermissionsException($"Tournament {tournament.Id} can't be modified by a user ${currentUserId} not owning it");
            }

            _context.Entry(storedTournament).State = EntityState.Detached;
            tournament.OwnerId = currentUserId;
            _context.Entry(tournament).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TournamentExists(tournament.Id))
                {
                    throw new NotFoundException($"There is no any tournament with id {tournament.Id}");
                }

                throw;
            }

            
        }



        private bool TournamentExists(int id)
        {
            return _context.Tournaments.Any(e => e.Id == id);
        }
    }
}