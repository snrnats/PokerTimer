using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PokerTimer.Api.Auth;
using PokerTimer.Api.Filters;
using PokerTimer.Api.ViewModel;

namespace PokerTimer.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/account")]
    public class AccountController : Controller
    {
        private readonly UserManager<PokerUser> _userManager;
        private readonly SignInManager<PokerUser> _signInManager;
        private static readonly TimeSpan AccessTokenLifeTime = TimeSpan.FromMinutes(30);

        public AccountController(UserManager<PokerUser> userManager, SignInManager<PokerUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Credentials credentials)
        {
            var refreshToken = Guid.NewGuid().ToString();
            var user = new PokerUser() {UserName = credentials.Email, Email = credentials.Email, RefreshToken = refreshToken};

            var result = await _userManager.CreateAsync(user, credentials.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _signInManager.SignInAsync(user, false);
            
            return Ok(CreateToken(user));
        }

        [HttpPost("token")]
        public async Task<IActionResult> SignIn([FromBody] AccessTokenRequest credentials)
        {
            var result = await _signInManager.PasswordSignInAsync(credentials.Username, credentials.Password, false, false);
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(credentials.Username);
            
            return Ok(CreateToken(user));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshAccessTokenRequest credentials)
        {
            var currentUser = await _userManager.FindByIdAsync(credentials.UserId);
            if (currentUser.RefreshToken != credentials.RefreshToken)
            {
                return BadRequest("Invalid refresh_token");
            }

            return Ok(CreateToken(currentUser));
        }


        private AccessTokenResponse CreateToken(PokerUser user)
        {
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this is the secret phrase"));
            var signingCredential = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            var expireDate = DateTimeOffset.UtcNow.Add(AccessTokenLifeTime);
            var jwt = new JwtSecurityToken(signingCredentials: signingCredential, claims: claims, expires: expireDate.UtcDateTime);
            var token = new JwtSecurityTokenHandler().WriteToken(jwt);
            return new AccessTokenResponse(token, expireDate.ToUnixTimeSeconds(), user.RefreshToken, user.Id);
        }
        [HttpPost("loginAnonymous")]
        public async Task<IActionResult> LoginAnonymous([FromBody] AnonymousCredentials credentials)
        {
            var existingUser = await _userManager.FindByIdAsync(credentials.DeviceId);

            if (existingUser == null)
            {
                var user = new PokerUser(){UserName = credentials.DeviceId};
                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded)
                {
                    return BadRequest();
                }

                existingUser = user;
            }

            return Ok(CreateToken(existingUser));
        }
    }
}