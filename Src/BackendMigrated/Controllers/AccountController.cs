using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PokerTimer.Api.Auth;
using PokerTimer.Api.Exceptions;
using PokerTimer.Api.ViewModel;

namespace PokerTimer.Api.Controllers;

[Produces("application/json")]
[Route("api/account")]
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
                ThrowException(result);
            }

            await _signInManager.SignInAsync(user, false);

            return BuildAuthorizedResult(user);
        }

    [HttpPost("token")]
    public async Task<IResult> SignIn([FromBody] Credentials credentials)
    {
        var result = await _signInManager.PasswordSignInAsync(credentials.Username, credentials.Password, true, false);
        if (!result.Succeeded)
            throw new ValidationException("Invalid Username or Password", new ValidationErrorItem[] { });

        var user = await _userManager.FindByNameAsync(credentials.Username);
        return BuildAuthorizedResult(user!);
    }

    private static IResult BuildAuthorizedResult(PokerUser user)
    {
        return Results.SignIn(new ClaimsPrincipal(
                new ClaimsIdentity(new Claim[]
                {
                    new Claim("user_id", user.Id)
                }, AuthConts.CookieAuthSchema)),
            properties: new AuthenticationProperties(){ IsPersistent = true},
            authenticationScheme: AuthConts.CookieAuthSchema);
    }

    [HttpPost("loginAnonymous")]
    public async Task<IResult> LoginAnonymous([FromBody] AnonymousCredentials credentials)
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

        return BuildAuthorizedResult(existingUser);
    }

    private static void ThrowException(IdentityResult identityResult)
    {
        if (!identityResult.Succeeded)
        {
            var items = new List<ValidationErrorItem>();
            foreach (var error in identityResult.Errors)
                if (error.Code == nameof(IdentityErrorDescriber.DuplicateUserName))
                {
                    var item = new ValidationErrorItem(nameof(Credentials.Username), error.Description);
                    items.Add(item);
                }

            if (items.Any()) throw new ValidationException("Can't register an account", items);
        }

        throw new DomainException(ErrorCode.IdentityError, string.Join(", ", identityResult.Errors));
    }
}