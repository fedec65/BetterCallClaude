-- BetterCallClaude v2.0 Database Schema (SQLite Version)
-- Simplified for development environment

-- BGE/ATF/DTF Decisions Table
CREATE TABLE IF NOT EXISTS bge_decisions (
  id TEXT PRIMARY KEY,
  citation TEXT UNIQUE NOT NULL,
  volume TEXT,
  chamber TEXT,
  page TEXT,
  title TEXT,
  date TEXT,
  language TEXT CHECK(language IN ('de', 'fr', 'it', 'en')),
  summary TEXT,
  legal_areas TEXT, -- JSON array stored as TEXT
  full_text TEXT,
  full_text_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bge_citation ON bge_decisions(citation);
CREATE INDEX IF NOT EXISTS idx_bge_date ON bge_decisions(date DESC);
CREATE INDEX IF NOT EXISTS idx_bge_chamber ON bge_decisions(chamber);
CREATE INDEX IF NOT EXISTS idx_bge_language ON bge_decisions(language);

-- Cantonal Court Decisions Table
CREATE TABLE IF NOT EXISTS cantonal_decisions (
  id TEXT PRIMARY KEY,
  canton TEXT NOT NULL CHECK(length(canton) = 2),
  citation TEXT UNIQUE NOT NULL,
  court_name TEXT,
  decision_number TEXT,
  title TEXT,
  date TEXT,
  language TEXT CHECK(language IN ('de', 'fr', 'it', 'en')),
  summary TEXT,
  legal_areas TEXT, -- JSON array stored as TEXT
  full_text TEXT,
  full_text_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cantonal_citation ON cantonal_decisions(citation);
CREATE INDEX IF NOT EXISTS idx_cantonal_canton ON cantonal_decisions(canton);
CREATE INDEX IF NOT EXISTS idx_cantonal_date ON cantonal_decisions(date DESC);

-- Search Query Log
CREATE TABLE IF NOT EXISTS search_queries (
  id TEXT PRIMARY KEY,
  query_text TEXT NOT NULL,
  query_type TEXT,
  filters TEXT, -- JSON stored as TEXT
  result_count INTEGER,
  execution_time_ms INTEGER,
  user_id TEXT,
  timestamp TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_timestamp ON search_queries(timestamp DESC);

-- Cache Table
CREATE TABLE IF NOT EXISTS api_cache (
  id TEXT PRIMARY KEY,
  cache_key TEXT UNIQUE NOT NULL,
  cache_type TEXT,
  data TEXT NOT NULL, -- JSON stored as TEXT
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  hit_count INTEGER DEFAULT 0,
  last_accessed_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON api_cache(expires_at);

-- Migration Tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now')),
  description TEXT
);
