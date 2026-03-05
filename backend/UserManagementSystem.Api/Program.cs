using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Infrastructure.ErrorHandling;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro do Tratamento de Erros Global
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Ativa o middleware de exceção
app.UseExceptionHandler();

// Mapeamento de Endpoints
app.MapCreateUserEndpoint();
app.MapGetUserEndpoint();

app.MapGet("/", () => "API rodando!");

app.Run();