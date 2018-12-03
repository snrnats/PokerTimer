using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using PokerTimer.Api.Extensions;
using PokerTimer.Api.Models.Tournament;
using PokerTimer.Api.Services;

namespace PokerTimer.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/tournaments")]
    public class TournamentsController : Controller
    {
        private readonly TournomentContext _context;
        private readonly TournamentService _tournamentService;

        public TournamentsController(TournomentContext context, TournamentService tournamentService)
        {
            _context = context;
            _tournamentService = tournamentService;
        }

        // GET: api/Tournaments
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Tournament>> GetTournaments()
        {
            return await _tournamentService.GetTournaments(User.GetUserId());
        }

        // GET: api/Tournaments/5
        [HttpGet("{id}")]
        public async Task<Tournament> GetTournament([FromRoute] int id)
        {
            return await _tournamentService.GetTournament(id);
        }

        // PUT: api/Tournaments/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTournament([FromRoute] int id, [FromBody] Tournament tournament)
        {
            if (id != tournament.Id)
            {
                return UnprocessableEntity();
            }

            await _tournamentService.UpdateTournament(tournament, User.GetUserId());

            return NoContent();
        }

        // POST: api/Tournaments
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostTournament([FromBody] Tournament tournament)
        {
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
            var tournament = await _context.Tournaments.SingleOrDefaultAsync(m => m.Id == id);

            if (tournament == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (tournament.OwnerId != userId)
            {
                return Forbid();
            }

            _context.Tournaments.Remove(tournament);
            await _context.SaveChangesAsync();

            return Ok(tournament);
        }

        [Authorize]
        [HttpPut("{id}/pause")]
        public async Task<IActionResult> PauseTournament([FromRoute] int id)
        {
            var tournament = await _tournamentService.GetTournament(id);

            if (tournament == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (tournament.OwnerId != userId)
            {
                return Forbid();
            }

            if (tournament.PauseStart != null)
            {
                tournament.PauseDuration += DateTimeOffset.UtcNow - tournament.PauseStart.Value;
            }
            tournament.PauseStart = DateTimeOffset.UtcNow;
            _context.Entry(tournament).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(tournament);
        }

        [Authorize]
        [HttpPut("{id}/resume")]
        public async Task<IActionResult> ResumeTournament([FromRoute] int id)
        {
            var tournament = await _tournamentService.GetTournament(id);

            if (tournament == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (tournament.OwnerId != userId)
            {
                return Forbid();
            }

            if (tournament.PauseStart != null)
            {
                tournament.PauseDuration += DateTimeOffset.UtcNow - tournament.PauseStart.Value;
                tournament.PauseStart = null;
                _context.Entry(tournament).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            return Ok(tournament);
        }
    }
}