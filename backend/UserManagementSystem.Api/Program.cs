using Microsoft.EntityFrameworkCore;
using UserManagementSystem.Api.Database;
using UserManagementSystem.Api.Infrastructure.ErrorHandling;
using UserManagementSystem.Api.Infrastructure.Endpoints;
using UserManagementSystem.Api.Features.Users.Existence;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro do Tratamento de Erros Global
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Configuração de CORS para permitir o Frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Descoberta Dinâmica de Endpoints (Vertical Slices architecture)
builder.Services.AddEndpoints(typeof(Program).Assembly);

// Serviços Bloom Filter e Validação
builder.Services.AddSingleton<IExistenceFilterService, ExistenceFilterService>();
builder.Services.AddHostedService<BloomFilterWorker>();

var app = builder.Build();

// Inicialização/Migração automática do Banco de Dados
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Aplica as migrações pendentes no startup
        dbContext.Database.Migrate();
        Console.WriteLine("Banco de Dados inicializado/migrado com sucesso.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao inicializar o Banco de Dados: {ex.Message}");
    }
}

// Ativa CORS
app.UseCors();

// Ativa o middleware de exceção
app.UseExceptionHandler();

// Mapeamento de Endpoints via Reflexão (Clean Architecture)
app.MapEndpoints();

app.MapGet("/", () => "API rodando!");

app.Run();