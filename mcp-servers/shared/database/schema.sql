-- BetterCallClaude v2.0 Database Schema
-- PostgreSQL-compatible with SQLite fallback support

-- BGE/ATF/DTF Decisions Table
CREATE TABLE IF NOT EXISTS bge_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citation VARCHAR(50) UNIQUE NOT NULL,
  volume VARCHAR(10),
  chamber VARCHAR(10),
  page VARCHAR(10),
  title TEXT,
  date TIMESTAMP,
  language VARCHAR(2),
  summary TEXT,
  legal_areas TEXT[],
  full_text TEXT,
  full_text_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for performance
  CONSTRAINT valid_language CHECK (language IN ('de', 'fr', 'it', 'en'))
);

CREATE INDEX IF NOT EXISTS idx_bge_citation ON bge_decisions(citation);
CREATE INDEX IF NOT EXISTS idx_bge_date ON bge_decisions(date DESC);
CREATE INDEX IF NOT EXISTS idx_bge_chamber ON bge_decisions(chamber);
CREATE INDEX IF NOT EXISTS idx_bge_language ON bge_decisions(language);
CREATE INDEX IF NOT EXISTS idx_bge_created_at ON bge_decisions(created_at DESC);

-- Full-text search index (PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_bge_fulltext ON bge_decisions USING GIN (to_tsvector('german', coalesce(title,'') || ' ' || coalesce(summary,'')));

-- Cantonal Court Decisions Table
CREATE TABLE IF NOT EXISTS cantonal_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canton VARCHAR(2) NOT NULL,
  citation VARCHAR(100) UNIQUE NOT NULL,
  court_name VARCHAR(200),
  decision_number VARCHAR(50),
  title TEXT,
  date TIMESTAMP,
  language VARCHAR(2),
  summary TEXT,
  legal_areas TEXT[],
  full_text TEXT,
  full_text_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_canton CHECK (canton ~ '^[A-Z]{2}$'),
  CONSTRAINT valid_language CHECK (language IN ('de', 'fr', 'it', 'en'))
);

CREATE INDEX IF NOT EXISTS idx_cantonal_citation ON cantonal_decisions(citation);
CREATE INDEX IF NOT EXISTS idx_cantonal_canton ON cantonal_decisions(canton);
CREATE INDEX IF NOT EXISTS idx_cantonal_date ON cantonal_decisions(date DESC);
CREATE INDEX IF NOT EXISTS idx_cantonal_language ON cantonal_decisions(language);

-- Search Query Log (for analytics and cache optimization)
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  query_type VARCHAR(50),
  filters JSONB,
  result_count INTEGER,
  execution_time_ms INTEGER,
  user_id VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_timestamp ON search_queries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_search_query_text ON search_queries(query_text);

-- Cache Table (for API responses and search results)
CREATE TABLE IF NOT EXISTS api_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key VARCHAR(500) UNIQUE NOT NULL,
  cache_type VARCHAR(50),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  hit_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON api_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_type ON api_cache(cache_type);

-- Migration Tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);
