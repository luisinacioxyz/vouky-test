using UserManagementSystem.Api.Database;

namespace UserManagementSystem.Api.Features.Users.Existence;

public class BloomFilterWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IExistenceFilterService _filterService;
    private readonly ILogger<BloomFilterWorker> _logger;

    public BloomFilterWorker(
        IServiceProvider serviceProvider, 
        IExistenceFilterService filterService,
        ILogger<BloomFilterWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _filterService = filterService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Iniciando Worker de atualização do Bloom Filter.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    _filterService.RefreshFilter(dbContext);
                    _logger.LogInformation("Bloom Filter atualizado com sucesso.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar o Bloom Filter.");
            }

            // Atualiza a cada 5 minutos
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
