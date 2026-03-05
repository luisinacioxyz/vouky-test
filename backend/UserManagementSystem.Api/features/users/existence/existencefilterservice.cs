using System.Collections;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using UserManagementSystem.Api.Database;

namespace UserManagementSystem.Api.Features.Users.Existence;

public interface IExistenceFilterService
{
    byte[] GetFilter();
    void RefreshFilter(AppDbContext dbContext);
    void Add(string value);
}

public class ExistenceFilterService : IExistenceFilterService
{
    private const int BitSize = 1048576; // 128KB (1 Megabit)
    private byte[] _cachedFilter = Array.Empty<byte>();
    private readonly object _lock = new();
    private readonly ILogger<ExistenceFilterService> _logger;

    public ExistenceFilterService(ILogger<ExistenceFilterService> logger)
    {
        _logger = logger;
    }

    public byte[] GetFilter()
    {
        return _cachedFilter;
    }

    public void RefreshFilter(AppDbContext dbContext)
    {
        // Constrói o filtro fora do lock para não bloquear leituras
        var activeUsers = dbContext.Users
            .Where(u => u.DeletedAt == null)
            .Select(u => new { u.Email, u.Id })
            .ToList();

        var bits = new BitArray(BitSize);

        foreach (var user in activeUsers)
        {
            // Normalização consistente: to lower e trim
            SetBits(bits, user.Email.ToLowerInvariant().Trim());
            SetBits(bits, user.Id.ToString().ToLowerInvariant().Trim());
        }

        byte[] bytes = new byte[(BitSize + 7) / 8];
        bits.CopyTo(bytes, 0);

        lock (_lock)
        {
            _cachedFilter = bytes;
        }
    }

    public void Add(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return;
        
        lock (_lock)
        {
            if (_cachedFilter.Length == 0) return;

            var bits = new BitArray(_cachedFilter);
            SetBits(bits, value.ToLowerInvariant().Trim());
            
            byte[] bytes = new byte[(BitSize + 7) / 8];
            bits.CopyTo(bytes, 0);
            _cachedFilter = bytes;
            _logger.LogInformation("Bloom Filter atualizado incrementalmente para: {Value}", value);
        }
    }

    private static void SetBits(BitArray bits, string value)
    {
        uint h1_raw = (uint)GetHash1(value);
        uint h2_raw = (uint)GetHash2(value);
        
        int h1 = (int)(h1_raw % (uint)BitSize);
        int h2 = (int)(h2_raw % (uint)BitSize);
        
        bits.Set(h1, true);
        bits.Set(h2, true);
    }

    private static int GetHash1(string input)
    {
        uint hash = 2166136261;
        foreach (char c in input)
        {
            hash = (hash ^ c) * 16777619;
        }
        return (int)hash;
    }

    private static int GetHash2(string input)
    {
        int hash = 0;
        int p = 31;
        int m = int.MaxValue;
        long p_pow = 1;
        foreach (char c in input)
        {
            hash = (int)((hash + (int)c * p_pow) % m);
            p_pow = (p_pow * p) % m;
        }
        return hash;
    }
}
