// Simplified database connection - using Supabase directly
import { logger } from '../utils/logger.js';

// Mock database functions for compatibility
export const testConnection = async () => {
  logger.info('Using Supabase database - connection test skipped');
  return true;
};

export const initDatabase = async () => {
  logger.info('Using Supabase database - initialization skipped');
  return true;
};

// Mock pool for compatibility
export const pool = {
  query: () => Promise.resolve({ rows: [] }),
  connect: () => Promise.resolve({ release: () => {} })
};

export default pool;
