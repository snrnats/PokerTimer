using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using PokerTimer.Api.Extensions;
using PokerTimer.Api.Models.Tournament;

namespace PokerTimer.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/tournaments")]
    public class TournamentsController : Controller
    {
        private readonly TournomentContext _context;

        public TournamentsController(TournomentContext context)
        {
            _context = context;
        }

        // GET: api/Tournaments
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Tournament>> GetTournaments()
        {
            var userId = User.GetUserId();
            var tournaments = await _context.Tournaments.Where(tournament => tournament.OwnerId == userId).Include(t => t.Setup).ThenInclude(s => s.Levels).ToListAsync();
            foreach (var tournament in tournaments)
            {
                tournament.Setup.Levels.Sort((x, y) => x.Index.CompareTo(y.Index));
            }

            return tournaments;
        }

        // GET: api/Tournaments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTournament([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tournament = await _context.Tournaments.Include(t => t.Setup).ThenInclude(s => s.Levels).SingleOrDefaultAsync(m => m.Id == id);

            if (tournament == null)
            {
                return NotFound();
            }

            return Ok(tournament);
        }

        // PUT: api/Tournaments/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTournament([FromRoute] int id, [FromBody] Tournament tournament)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tournament.Id)
            {
                return BadRequest();
            }

            var storedTournament = await _context.Tournaments.FindAsync(id);
            var userId = User.GetUserId();

            if (storedTournament.OwnerId != userId)
            {
                return BadRequest();
            }

            _context.Entry(storedTournament).State = EntityState.Detached;
            tournament.OwnerId = userId;
            _context.Entry(tournament).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TournamentExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // POST: api/Tournaments
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostTournament([FromBody] Tournament tournament)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.GetUserId();
            tournament.OwnerId = userId;
            _context.Tournaments.Add(tournament);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTournament", new {id = tournament.Id}, tournament);
        }

        // DELETE: api/Tournaments/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTournament([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tournament = await _context.Tournaments.SingleOrDefaultAsync(m => m.Id == id);

            if (tournament == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (tournament.OwnerId != userId)
            {
                return BadRequest();
            }

            _context.Tournaments.Remove(tournament);
            await _context.SaveChangesAsync();

            return Ok(tournament);
        }

        [Authorize]
        [HttpPut("pause/{id}")]
        public async Task<IActionResult> PauseTournament([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tournament = await _context.Tournaments.SingleOrDefaultAsync(t => t.Id == id);

            if (tournament == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (tournament.OwnerId != userId)
            {
                return BadRequest();
            }

            tournament.IsPaused = true;
            _context.Entry(tournament).Property(nameof(Tournament.IsPaused)).IsModified = true;
            await _context.SaveChangesAsync();

            return Ok(tournament);
        }

        private bool TournamentExists(int id)
        {
            return _context.Tournaments.Any(e => e.Id == id);
        }
    }
}