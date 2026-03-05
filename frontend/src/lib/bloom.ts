/**
 * Bloom Filter Client implementation.
 * Hydrated from the /users/existence-filter endpoint.
 */
export class BloomFilter {
    private readonly bitSize = 1048576; // 128KB (1 Megabit)
    private bits: Uint8Array;

    constructor(data: ArrayBuffer) {
        this.bits = new Uint8Array(data);
    }

    public mightContain(value: string): boolean {
        if (!value) return false;

        const normalizedValue = value.toLowerCase().trim();

        const h1 = (this.getHash1(normalizedValue) >>> 0) % this.bitSize;
        const h2 = (this.getHash2(normalizedValue) >>> 0) % this.bitSize;

        return this.getBit(h1) && this.getBit(h2);
    }

    private getBit(index: number): boolean {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = index % 8;
        return (this.bits[byteIndex] & (1 << bitIndex)) !== 0;
    }

    private getHash1(input: string): number {
        let hash = 2166136261;
        for (let i = 0; i < input.length; i++) {
            hash = Math.imul(hash ^ input.charCodeAt(i), 16777619);
        }
        return hash >>> 0;
    }

    private getHash2(input: string): number {
        let hash = 0;
        const p = 31;
        const m = 0x7FFFFFFF;
        let p_pow = 1;
        for (let i = 0; i < input.length; i++) {
            // Usa charCodeAt diretamente, sem subtrair 96 para evitar problemas com caracteres especiais e sinais negativos
            hash = (hash + input.charCodeAt(i) * p_pow) % m;
            p_pow = (p_pow * p) % m;
        }
        return hash;
    }
}

/**
 * Singleton-like manager for the global existence filter.
 * Prevents race conditions during multiple rapid calls.
 */
class ExistenceManager {
    private filter: BloomFilter | null = null;
    private fetchPromise: Promise<BloomFilter | null> | null = null;
    private lastFetch: number = 0;
    private readonly REFRESH_INTERVAL = 60000; // 1 minute

    async getFilter(force = false): Promise<BloomFilter | null> {
        const now = Date.now();
        if (this.filter && !force && now - this.lastFetch <= this.REFRESH_INTERVAL) {
            return this.filter;
        }

        if (!this.fetchPromise) {
            this.fetchPromise = this.executeFetch();
        }

        return this.fetchPromise;
    }

    private async executeFetch(): Promise<BloomFilter | null> {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052';
            console.log("Hydrating Bloom Filter from:", apiUrl);

            const response = await fetch(`${apiUrl}/users/existence-filter`, { cache: 'no-store' });
            if (response.ok) {
                const buffer = await response.arrayBuffer();
                if (buffer.byteLength > 0) {
                    this.filter = new BloomFilter(buffer);
                    this.lastFetch = Date.now();
                }
            }
        } catch (e) {
            console.error("Failed to fetch existence filter", e);
        } finally {
            this.fetchPromise = null;
        }
        return this.filter;
    }

    // Hook-like helper for components
    async checkAvailability(value: string): Promise<boolean | "check_api"> {
        const bf = await this.getFilter();
        if (!bf) return "check_api";

        const mightExist = bf.mightContain(value);
        if (!mightExist) return true; // Definitely available
        return "check_api"; // Might exist, need to check API
    }
}

export const existenceManager = new ExistenceManager();
