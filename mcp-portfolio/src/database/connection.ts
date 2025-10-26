/**
 * Database connection pool management
 */

import mariadb from 'mariadb';
import { DB_CONFIG, APP_CONFIG } from '../config.js';

/**
 * Database connection pool
 */
let pool: mariadb.Pool | null = null;

/**
 * Create and return the database connection pool (singleton)
 */
export function getPool(): mariadb.Pool {
  if (!pool) {
    pool = mariadb.createPool(DB_CONFIG);
    
    if (APP_CONFIG.logLevel === 'debug') {
      console.log('[DB] Connection pool created', {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        database: DB_CONFIG.database,
        user: DB_CONFIG.user,
      });
    }
  }
  
  return pool;
}

/**
 * Get a connection from the pool
 */
export async function getConnection(): Promise<mariadb.PoolConnection> {
  const pool = getPool();
  return await pool.getConnection();
}

/**
 * Execute a query with automatic connection management
 * 
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Query results
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const conn = await getConnection();
  try {
    if (APP_CONFIG.logSqlQueries) {
      console.log('[DB] Query:', sql, params);
    }
    
    const results = await conn.query(sql, params);
    return results as T[];
  } finally {
    conn.release();
  }
}

/**
 * Execute a batch of queries in a transaction
 * 
 * @param callback Function that receives a connection and performs queries
 * @returns Result from callback
 */
export async function transaction<T>(
  callback: (conn: mariadb.PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await getConnection();
  
  try {
    await conn.beginTransaction();
    
    const result = await callback(conn);
    
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const conn = await getConnection();
    await conn.query('SELECT 1');
    conn.release();
    return true;
  } catch (error) {
    console.error('[DB] Connection test failed:', error);
    return false;
  }
}

/**
 * Close the connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    
    if (APP_CONFIG.logLevel === 'debug') {
      console.log('[DB] Connection pool closed');
    }
  }
}

/**
 * Helper to handle dates in queries
 * MariaDB returns dates as strings, this converts them back
 */
export function parseDate(dateString: string | Date | null): Date | null {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  return new Date(dateString);
}

/**
 * Helper to format dates for SQL
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

