using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using PokerTimer.Api.Auth;
using PokerTimer.Api.Configuration;

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AccountContext>(o => o.UseInMemoryDatabase("InMemory"));
builder.Services.AddIdentityCore<PokerUser>()
    .AddEntityFrameworkStores<AccountContext>()
    .AddSignInManager();
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();
builder.Services.AddAuthorization()
    .AddTransient<IAuthorizationMiddlewareResultHandler, AuthResultStatusCodeHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddCors();

builder.Services.AddOptions<CorsConfig>()
    .BindConfiguration("Cors")
    .ValidateDataAnnotations()
    .ValidateOnStart();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(b =>
{
    b.WithOrigins(app.Services.GetRequiredService<IOptions<CorsConfig>>().Value.AllowedOrigins)
        .WithHeaders(HeaderNames.ContentType, HeaderNames.AccessControlAllowCredentials)
        .AllowCredentials();
});
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();