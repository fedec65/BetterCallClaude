/**
 * Jest test setup file
 * Configures test environment and global mocks
 */

// Mock environment variables for testing
process.env.NODE_ENV = 'development'; // Config validation only accepts development/staging/production
process.env.DATABASE_TYPE = 'sqlite';
process.env.DATABASE_PATH = ':memory:';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
