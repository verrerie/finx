/**
 * Tests for createPortfolio handler
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPortfolio } from './createPortfolio.js';
import { MockPortfolioService, mockPortfolio, createMockContext } from '../../__tests__/mocks.js';

describe('createPortfolio Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should create a portfolio successfully', async () => {
    mockService.createPortfolio.mockResolvedValue(mockPortfolio);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await createPortfolio(
      { name: 'Test Portfolio', description: 'Test description', currency: 'USD' },
      ctx
    );

    expect(mockService.createPortfolio).toHaveBeenCalledWith({
      name: 'Test Portfolio',
      description: 'Test description',
      currency: 'USD',
    });

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.portfolio.id).toBe(mockPortfolio.id);
    expect(parsed.portfolio.name).toBe(mockPortfolio.name);
    expect(parsed.message).toContain('Test Portfolio');
  });

  it('should create a portfolio with minimal arguments', async () => {
    mockService.createPortfolio.mockResolvedValue(mockPortfolio);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await createPortfolio({ name: 'Minimal Portfolio' }, ctx);

    expect(mockService.createPortfolio).toHaveBeenCalledWith({
      name: 'Minimal Portfolio',
      description: undefined,
      currency: undefined,
    });

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
  });

  it('should return error when name is missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await createPortfolio({}, ctx);

    expect(mockService.createPortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await createPortfolio(null, ctx);

    expect(mockService.createPortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is undefined', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await createPortfolio(undefined, ctx);

    expect(mockService.createPortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors gracefully', async () => {
    mockService.createPortfolio.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(
      createPortfolio({ name: 'Test Portfolio' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

