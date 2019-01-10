using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PokerTimer.Api.Auth;
using PokerTimer.Api.Exceptions;
using PokerTimer.Api.ViewModel;

namespace PokerTimer.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/account")]
    [ApiController]
    public class AccountController : Controller
    {
        private static readonly TimeSpan AccessTokenLifeTime = TimeSpan.FromMinutes(30);
        private readonly SignInManager<PokerUser> _signInManager;
        private readonly UserManager<PokerUser> _userManager;

        public AccountController(UserManager<PokerUser> userManager, SignInManager<PokerUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<AccessTokenResponse> Register([FromBody] Credentials credentials)
        {
            var refreshToken = Guid.NewGuid().ToString();
            var user = new PokerUser {UserName = credentials.Username, Email = credentials.Username, RefreshToken = refreshToken};

            var result = await _userManager.CreateAsync(user, credentials.Password);

            if (!result.Succeeded)
            {
                ThrowException(result);
            }

            await _signInManager.SignInAsync(user, false);

            return CreateToken(user);
        }

        [HttpPost("token")]
        public async Task<AccessTokenResponse> SignIn([FromBody] Credentials credentials)
        {
            var result = await _signInManager.PasswordSignInAsync(credentials.Username, credentials.Password, false, false);
            if (!result.Succeeded)
            {
                throw new ValidationException("Invalid Username or Password", new ValidationErrorItem[] { });
            }

            var user = await _userManager.FindByNameAsync(credentials.Username);

            return CreateToken(user);
        }

        [HttpPost("refresh-token")]
        public async Task<AccessTokenResponse> RefreshToken([FromBody] RefreshAccessTokenRequest credentials)
        {
            var currentUser = await _userManager.FindByIdAsync(credentials.UserId);
            if (currentUser?.RefreshToken != credentials.RefreshToken)
            {
                throw new DomainException(ErrorCode.InvalidRefreshToken, "Invalid refresh token");
            }

            return CreateToken(currentUser);
        }

        [HttpPost("loginAnonymous")]
        public async Task<IActionResult> LoginAnonymous([FromBody] AnonymousCredentials credentials)
        {
            var existingUser = await _userManager.FindByIdAsync(credentials.DeviceId);

            if (existingUser == null)
            {
                var user = new PokerUser {UserName = credentials.DeviceId};
                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded)
                {
                    ThrowException(result);
                }

                existingUser = user;
            }

            return Ok(CreateToken(existingUser));
        }

        private AccessTokenResponse CreateToken(PokerUser user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id)
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this is the secret phrase"));
            var signingCredential = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            var expireDate = DateTimeOffset.UtcNow.Add(AccessTokenLifeTime);
            var jwt = new JwtSecurityToken(signingCredentials: signingCredential, claims: claims, expires: expireDate.UtcDateTime);
            var token = new JwtSecurityTokenHandler().WriteToken(jwt);
            return new AccessTokenResponse(token, expireDate.ToUnixTimeSeconds(), user.RefreshToken, user.Id);
        }

        private static void ThrowException(IdentityResult identityResult)
        {
            if (!identityResult.Succeeded)
            {
                var items = new List<ValidationErrorItem>();
                foreach (var error in identityResult.Errors)
                {
                    if (error.Code == nameof(IdentityErrorDescriber.DuplicateUserName))
                    {
                        var item = new ValidationErrorItem(nameof(Credentials.Username), error.Description);
                        items.Add(item);
                    }
                }

                if (items.Any())
                {
                    throw new ValidationException("Can't register an account", items);
                }
            }

            throw new DomainException(ErrorCode.IdentityError, string.Join(", ", identityResult.Errors));
        }
    }
}