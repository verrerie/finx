/**
 * Rate limiter for API calls
 * Alpha Vantage free tier: 5 calls/minute, 25 calls/day
 */

export class RateLimiter {
    private queue: Array<() => Promise<any>> = [];
    private callTimestamps: number[] = [];
    private processing = false;

    constructor(
        private maxCallsPerMinute: number = 5,
        private maxCallsPerDay: number = 25
    ) { }

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
        const oneMinuteAgo = now - 60 * 1000;
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        // Clean old timestamps
        this.callTimestamps = this.callTimestamps.filter(ts => ts > oneDayAgo);

        const callsLastMinute = this.callTimestamps.filter(ts => ts > oneMinuteAgo).length;
        const callsLastDay = this.callTimestamps.length;

        return callsLastMinute < this.maxCallsPerMinute && callsLastDay < this.maxCallsPerDay;
    }

    private getWaitTime(): number {
        const now = Date.now();
        const oneMinuteAgo = now - 60 * 1000;

        const recentCalls = this.callTimestamps.filter(ts => ts > oneMinuteAgo);

        if (recentCalls.length >= this.maxCallsPerMinute) {
            // Wait until oldest call in the minute window expires
            const oldestInWindow = Math.min(...recentCalls);
            return (oldestInWindow + 60 * 1000) - now + 1000; // +1s buffer
        }

        return 1000; // Default 1 second
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getStats(): { callsLastMinute: number; callsLastDay: number } {
        const now = Date.now();
        const oneMinuteAgo = now - 60 * 1000;
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        this.callTimestamps = this.callTimestamps.filter(ts => ts > oneDayAgo);

        return {
            callsLastMinute: this.callTimestamps.filter(ts => ts > oneMinuteAgo).length,
            callsLastDay: this.callTimestamps.length,
        };
    }
}

