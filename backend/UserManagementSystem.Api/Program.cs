using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Infrastructure.ErrorHandling;
using UserManagementSystem.Api.Infrastructure.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro do Tratamento de Erros Global
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Descoberta Dinâmica de Endpoints (Vertical Slices architecture)
builder.Services.AddEndpoints(typeof(Program).Assembly);

var app = builder.Build();

// Ativa o middleware de exceção
app.UseExceptionHandler();

// Mapeamento de Endpoints via Reflexão (Clean Architecture)
app.MapEndpoints();

app.MapGet("/", () => "API rodando!");

app.Run();