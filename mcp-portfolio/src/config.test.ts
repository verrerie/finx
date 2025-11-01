/**
 * Tests for config
 */

import { describe, it, expect } from 'vitest';
import { SERVER_INFO, DB_CONFIG } from './config.js';

describe('Config', () => {
  describe('SERVER_INFO', () => {
    it('should have name and version', () => {
      expect(SERVER_INFO.name).toBe('finx-portfolio');
      expect(SERVER_INFO.version).toBe('0.1.0');
    });
  });

  describe('DB_CONFIG', () => {
    it('should have required database configuration properties', () => {
      expect(DB_CONFIG).toHaveProperty('host');
      expect(DB_CONFIG).toHaveProperty('port');
      expect(DB_CONFIG).toHaveProperty('database');
      expect(DB_CONFIG).toHaveProperty('user');
      expect(DB_CONFIG).toHaveProperty('password');
    });

    it('should use default values when env vars not set', () => {
      expect(DB_CONFIG.host).toBe(process.env.DB_HOST || 'localhost');
      expect(DB_CONFIG.port).toBe(Number(process.env.DB_PORT) || 3306);
      expect(DB_CONFIG.database).toBe(process.env.DB_NAME || 'finx');
      expect(DB_CONFIG.user).toBe(process.env.DB_USER || 'finx_user');
    });
  });
});

