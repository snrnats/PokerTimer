using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PokerTimer.Api.Auth;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(AuthConts.CookieAuthSchema)
    .AddCookie(AuthConts.CookieAuthSchema);
builder.Services.AddAuthorization();
builder.Services.AddDbContext<AccountContext>(o => o.UseInMemoryDatabase("InMemory"));
builder.Services.AddIdentity<PokerUser, IdentityRole>(o => { })
    .AddEntityFrameworkStores<AccountContext>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();