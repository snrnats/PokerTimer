using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokerTimer.Api.Extensions;
using PokerTimer.Api.Models.Tournament;

namespace PokerTimer.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/setups")]
    public class SetupsController : Controller
    {
        private readonly DbContext _context;

        public SetupsController(DbContext context)
        {
            _context = context;
        }

        // GET: api/Setups
        [Authorize]
        [HttpGet]
        public IEnumerable<Setup> GetSetup([FromQuery] SetupOwnerFilter owner)
        {
            var userId = User.GetUserId();
            IQueryable<Setup> setups = _context.Setups.Include(s => s.Levels);
            if (owner == SetupOwnerFilter.Me)
            {
                setups = setups.Where(setup => setup.OwnerId == userId);
            }

            foreach (var setup in setups)
            {
                setup.Levels.Sort((x, y) => x.Index.CompareTo(y.Index));
            }

            return setups;
        }

        // GET: api/Setups/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSetup([FromRoute] int id)
        {
            var setup = await _context.Setups.Include(s => s.Levels).SingleOrDefaultAsync(m => m.Id == id);
            if (setup == null)
            {
                return NotFound("No setups were found with the specified id");
            }

            setup.Levels.Sort((x, y) => x.Index.CompareTo(y.Index));

            return Ok(setup);
        }

        // PUT: api/Setups/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSetup([FromRoute] int id, [FromBody] Setup setup)
        {
            if (id != setup.Id)
            {
                return UnprocessableEntity("Id in the requested url doesn't match id in body");
            }

            var storedSetup = await _context.Setups.AsNoTracking().Include(s => s.Levels)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (storedSetup == null)
            {
                return await PostSetup(setup);
            }

            var userId = User.GetUserId();
            if (storedSetup.OwnerId != userId)
            {
                return Forbid("Can't edit a setup you don't own");
            }

            _context.Set<Level>().RemoveRange(storedSetup.Levels);

            setup.OwnerId = userId;
            SetLevelIndexes(setup);
            _context.Setups.Update(setup);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SetupExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // POST: api/Setups
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostSetup([FromBody] Setup setup)
        {
            var userId = User.GetUserId();
            setup.OwnerId = userId;
            SetLevelIndexes(setup);
            _context.Setups.Add(setup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSetup", new {id = setup.Id}, setup);
        }

        // DELETE: api/Setups/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSetup([FromRoute] int id)
        {
            var setup = await _context.Setups.SingleOrDefaultAsync(m => m.Id == id);
            if (setup == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (setup.OwnerId != userId)
            {
                return Forbid();
            }

            _context.Setups.Remove(setup);
            await _context.SaveChangesAsync();

            return Ok(setup);
        }

        private bool SetupExists(int id)
        {
            return _context.Setups.Any(e => e.Id == id);
        }

        private void SetLevelIndexes(Setup setup)
        {
            for (var i = 0; i < setup.Levels.Count; i++)
            {
                setup.Levels[i].Index = i;
            }
        }
    }
}