using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PokerTimer.Api.Auth;

namespace PokerTimer.Api.Controllers;

[Produces("application/json")]
[Route("api/accounts")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly SignInManager<PokerUser> _signInManager;
    private readonly UserManager<PokerUser> _userManager;

    public AccountController(UserManager<PokerUser> userManager, SignInManager<PokerUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }
        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] Credentials credentials)
        {
            var user = new PokerUser {UserName = credentials.Username, Email = credentials.Username};

            var result = await _userManager.CreateAsync(user, credentials.Password);

            if (!result.Succeeded)
            {
                return Results.Problem(result.Errors.First().Description, statusCode: StatusCodes.Status400BadRequest);
            }

            await _signInManager.SignInAsync(user, true);

            return BuildAuthorizedResult(user);
        }

    [HttpPost("login")]
    public async Task<IResult> Login([FromBody] Credentials credentials)
    {
        var result = await _signInManager.PasswordSignInAsync(credentials.Username, credentials.Password, true, false);
        if (!result.Succeeded)
            return Results.Problem( "Invalid Username or Password", statusCode: StatusCodes.Status401Unauthorized);

        var user = await _userManager.FindByNameAsync(credentials.Username);
        return BuildAuthorizedResult(user!);
    }

    [HttpPost("login-anonymous")]
    public async Task<IResult> LoginAnonymous([FromBody] AnonymousCredentials credentials)
    {
        var existingUser = await _userManager.FindByIdAsync(credentials.DeviceId);

        if (existingUser == null)
        {
            var user = new PokerUser {UserName = credentials.DeviceId};
            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded)
            {
                return Results.Problem(result.Errors.First().Description, statusCode: StatusCodes.Status401Unauthorized);
            }

            existingUser = user;
        }

        return BuildAuthorizedResult(existingUser);
    }

    private static IResult BuildAuthorizedResult(PokerUser user)
    {
        return Results.SignIn(new ClaimsPrincipal(
                new ClaimsIdentity(new[]
                {
                    new Claim("user_id", user.Id)
                }, AuthConts.CookieAuthSchema)),
            properties: new AuthenticationProperties { IsPersistent = true},
            authenticationScheme: AuthConts.CookieAuthSchema);
    }
}