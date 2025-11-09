/**
 * Rate limiter for API calls
 * Supports different limit types: per-second, per-minute, per-day, per-month
 */

export interface RateLimiterConfig {
    /** Maximum calls per second (optional) */
    callsPerSecond?: number;
    /** Maximum calls per minute (optional) */
    callsPerMinute?: number;
    /** Maximum calls per day (optional) */
    callsPerDay?: number;
    /** Maximum calls per month (optional) */
    callsPerMonth?: number;
}

export class RateLimiter {
    private queue: Array<() => Promise<any>> = [];
    private callTimestamps: number[] = [];
    private processing = false;

    constructor(
        private config: RateLimiterConfig = {}
    ) {
        // Backward compatibility: support old constructor signature
        if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            this.config = {
                callsPerMinute: arguments[0] as number,
                callsPerDay: arguments[1] as number,
            };
        }
    }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0) {
            // Check rate limits
            if (!this.canMakeCall()) {
                // Wait and retry
                await this.sleep(this.getWaitTime());
                continue;
            }

            const fn = this.queue.shift();
            if (fn) {
                this.callTimestamps.push(Date.now());
                await fn();
            }
        }

        this.processing = false;
    }

    private canMakeCall(): boolean {
        const now = Date.now();
        const oneSecondAgo = now - 1000;
        const oneMinuteAgo = now - 60 * 1000;
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

        // Clean old timestamps (keep up to 1 month for monthly limits)
        const maxAge = this.config.callsPerMonth ? oneMonthAgo : oneDayAgo;
        this.callTimestamps = this.callTimestamps.filter(ts => ts > maxAge);

        // Check per-second limit
        if (this.config.callsPerSecond !== undefined) {
            const callsLastSecond = this.callTimestamps.filter(ts => ts > oneSecondAgo).length;
            if (callsLastSecond >= this.config.callsPerSecond) {
                return false;
            }
        }

        // Check per-minute limit
        if (this.config.callsPerMinute !== undefined) {
            const callsLastMinute = this.callTimestamps.filter(ts => ts > oneMinuteAgo).length;
            if (callsLastMinute >= this.config.callsPerMinute) {
                return false;
            }
        }

        // Check per-day limit
        if (this.config.callsPerDay !== undefined) {
            const callsLastDay = this.callTimestamps.filter(ts => ts > oneDayAgo).length;
            if (callsLastDay >= this.config.callsPerDay) {
                return false;
            }
        }

        // Check per-month limit
        if (this.config.callsPerMonth !== undefined) {
            const callsLastMonth = this.callTimestamps.filter(ts => ts > oneMonthAgo).length;
            if (callsLastMonth >= this.config.callsPerMonth) {
                return false;
            }
        }

        return true;
    }

    private getWaitTime(): number {
        const now = Date.now();
        const oneSecondAgo = now - 1000;
        const oneMinuteAgo = now - 60 * 1000;

        // Check per-second limit first (most restrictive)
        if (this.config.callsPerSecond !== undefined) {
            const recentCalls = this.callTimestamps.filter(ts => ts > oneSecondAgo);
            if (recentCalls.length >= this.config.callsPerSecond) {
                const oldestInWindow = Math.min(...recentCalls);
                return (oldestInWindow + 1000) - now + 100; // +100ms buffer
            }
        }

        // Check per-minute limit
        if (this.config.callsPerMinute !== undefined) {
            const recentCalls = this.callTimestamps.filter(ts => ts > oneMinuteAgo);
            if (recentCalls.length >= this.config.callsPerMinute) {
                const oldestInWindow = Math.min(...recentCalls);
                return (oldestInWindow + 60 * 1000) - now + 1000; // +1s buffer
            }
        }

        // For per-day or per-month limits, wait a bit and retry
        return 1000; // Default 1 second
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getStats(): {
        callsLastSecond?: number;
        callsLastMinute?: number;
        callsLastDay?: number;
        callsLastMonth?: number;
    } {
        const now = Date.now();
        const oneSecondAgo = now - 1000;
        const oneMinuteAgo = now - 60 * 1000;
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

        // Clean old timestamps
        const maxAge = this.config.callsPerMonth ? oneMonthAgo : oneDayAgo;
        this.callTimestamps = this.callTimestamps.filter(ts => ts > maxAge);

        const stats: {
            callsLastSecond?: number;
            callsLastMinute?: number;
            callsLastDay?: number;
            callsLastMonth?: number;
        } = {};

        if (this.config.callsPerSecond !== undefined) {
            stats.callsLastSecond = this.callTimestamps.filter(ts => ts > oneSecondAgo).length;
        }
        if (this.config.callsPerMinute !== undefined) {
            stats.callsLastMinute = this.callTimestamps.filter(ts => ts > oneMinuteAgo).length;
        }
        if (this.config.callsPerDay !== undefined) {
            stats.callsLastDay = this.callTimestamps.filter(ts => ts > oneDayAgo).length;
        }
        if (this.config.callsPerMonth !== undefined) {
            stats.callsLastMonth = this.callTimestamps.filter(ts => ts > oneMonthAgo).length;
        }

        return stats;
    }
}

/**
 * Factory function to create rate limiters with different configurations
 */
export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
    return new RateLimiter(config);
}

