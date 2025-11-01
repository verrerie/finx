/**
 * Tests for response utilities
 */

import { describe, it, expect } from 'vitest';
import { success, error } from './response.js';

describe('Response Utilities', () => {
  describe('success', () => {
    it('should create a success response with provided content', () => {
      const content = { portfolio: { id: '123', name: 'Test' } };
      const result = success(content);

      expect(result).toHaveProperty('content');
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.isError).toBeUndefined();

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.success).toBe(true);
      expect(parsed.portfolio).toEqual(content.portfolio);
    });

    it('should include success: true in the response', () => {
      const result = success({ data: 'test' });
      const parsed = JSON.parse(result.content[0].text);

      expect(parsed.success).toBe(true);
    });

    it('should preserve all properties in the response', () => {
      const content = {
        message: 'Operation completed',
        count: 5,
        items: ['a', 'b', 'c'],
      };
      const result = success(content);
      const parsed = JSON.parse(result.content[0].text);

      expect(parsed.message).toBe(content.message);
      expect(parsed.count).toBe(content.count);
      expect(parsed.items).toEqual(content.items);
    });

    it('should format JSON with indentation', () => {
      const result = success({ test: 'value' });
      const text = result.content[0].text;

      // JSON.stringify with null, 2 should create indented JSON
      expect(text).toContain('  ');
      expect(text.split('\n').length).toBeGreaterThan(1);
    });
  });

  describe('error', () => {
    it('should create an error response with the provided message', () => {
      const message = 'Something went wrong';
      const result = error(message);

      expect(result).toHaveProperty('content');
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.isError).toBe(true);

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.success).toBe(false);
      expect(parsed.error).toBe(message);
    });

    it('should set isError to true', () => {
      const result = error('Test error');
      expect(result.isError).toBe(true);
    });

    it('should format JSON with indentation', () => {
      const result = error('Test error');
      const text = result.content[0].text;

      // JSON.stringify with null, 2 should create indented JSON
      expect(text).toContain('  ');
      expect(text.split('\n').length).toBeGreaterThan(1);
    });

    it('should handle long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      const result = error(longMessage);
      const parsed = JSON.parse(result.content[0].text);

      expect(parsed.error).toBe(longMessage);
    });

    it('should handle special characters in error messages', () => {
      const specialMessage = 'Error: "value" must be > 0 & < 100';
      const result = error(specialMessage);
      const parsed = JSON.parse(result.content[0].text);

      expect(parsed.error).toBe(specialMessage);
    });
  });
});

