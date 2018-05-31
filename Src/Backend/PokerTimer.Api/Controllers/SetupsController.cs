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
        private readonly TournomentContext _context;

        public SetupsController(TournomentContext context)
        {
            _context = context;
        }

        // GET: api/Setups
        [Authorize]
        [HttpGet]
        public IEnumerable<Setup> GetSetup()
        {
            var userId = User.GetUserId();
            var setups = _context.Setups.Include(s => s.Levels).Where(setup => setup.OwnerId == userId);
            return setups;
        }

        // GET: api/Setups/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSetup([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var setup = await _context.Setups.Include(s => s.Levels).SingleOrDefaultAsync(m => m.Id == id);

            if (setup == null)
            {
                return NotFound();
            }

            return Ok(setup);
        }

        // PUT: api/Setups/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSetup([FromRoute] int id, [FromBody] Setup setup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != setup.Id)
            {
                return BadRequest();
            }

            var storedSetup = await _context.Setups.FindAsync(id);
            var userId = User.GetUserId();
            if (storedSetup.OwnerId != userId)
            {
                return BadRequest();
            }

            _context.Entry(storedSetup).State = EntityState.Detached;
            setup.OwnerId = userId;
            _context.Entry(setup).State = EntityState.Modified;

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
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Setups
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostSetup([FromBody] Setup setup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.GetUserId();
            setup.OwnerId = userId;
            _context.Setups.Add(setup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSetup", new { id = setup.Id }, setup);
        }

        // DELETE: api/Setups/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSetup([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var setup = await _context.Setups.SingleOrDefaultAsync(m => m.Id == id);
            if (setup == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (setup.OwnerId != userId)
            {
                return BadRequest();
            }

            _context.Setups.Remove(setup);
            await _context.SaveChangesAsync();

            return Ok(setup);
        }

        private bool SetupExists(int id)
        {
            return _context.Setups.Any(e => e.Id == id);
        }
    }
}