using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ShiftManagerApi.Data;
using ShiftManagerApi.Interfaces;
using ShiftManagerApi.Services;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "Shift Manager Api", Version = "v1" });
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserAuthService, UserAuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ICookieService, CookieService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IProviderServiceService, ProviderServiceService>();
builder.Services.AddScoped<IWorkSchedulesService, WorkSchedulesService>();
builder.Services.AddScoped<IShiftService, ShiftService>();
builder.Services.AddScoped<IProviderService, ProviderService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IRoleService, RoleService>();

builder.Services.AddDbContext<ShiftManagerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = jwtSettings["Issuer"],
    ValidAudience = jwtSettings["Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(key)
  };

  options.Events = new JwtBearerEvents
  {
    OnMessageReceived = context =>
    {
      context.Token = context.Request.Cookies["accessToken"];
      return Task.CompletedTask;
    }
  };
});

builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("Administrador", policy => policy.RequireClaim("active_role", "Administrador"));
  options.AddPolicy("Proveedor", policy => policy.RequireClaim("active_role", "Proveedor"));
  options.AddPolicy("Recepcion", policy => policy.RequireClaim("active_role", "Recepcion"));
  options.AddPolicy("Cliente", policy => policy.RequireClaim("active_role", "Cliente"));
  options.AddPolicy("AdminORecepcion", policy => policy.RequireClaim("active_role", "Administrador","Recepcion"));
  options.AddPolicy("AdminOProveedor", policy => policy.RequireClaim("active_role", "Administrador","Proveedor"));
  options.AddPolicy("AnyAuthenticatedRole", policy => policy.RequireClaim("active_role", "Administrador","Proveedor", "Recepcion", "Cliente"));
  options.AddPolicy("NonProvider", policy => policy.RequireClaim("active_role", "Administrador", "Recepcion", "Cliente"));
  options.AddPolicy("NonReception", policy => policy.RequireClaim("active_role", "Administrador", "Recepcion", "Cliente"));
});

builder.Services.AddAuthorization();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

using (var scope = app.Services.CreateScope())
{
  var dbContext = scope.ServiceProvider.GetRequiredService<ShiftManagerContext>();
  dbContext.Database.Migrate();
  DbSeeder.Seed(dbContext);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
