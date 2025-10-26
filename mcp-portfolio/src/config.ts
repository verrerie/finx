/**
 * Configuration for Portfolio MCP Server
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database configuration
 */
export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME || 'finx',
  user: process.env.DB_USER || 'finx_user',
  password: process.env.DB_PASSWORD || 'finx_password',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0', 10),
  acquireTimeout: 30000,
  connectTimeout: 10000,
  charset: 'utf8mb4',
} as const;

/**
 * Application configuration
 */
export const APP_CONFIG = {
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  logSqlQueries: process.env.LOG_SQL_QUERIES === 'true',
} as const;

/**
 * MCP Server information
 */
export const SERVER_INFO = {
  name: 'finx-portfolio',
  version: '0.1.0',
  description: 'Portfolio Management MCP Server for FinX - Track holdings, transactions, and performance',
} as const;

