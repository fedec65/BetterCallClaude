# Sprint 3 Implementation Plan
**Project**: BetterCallClaude v2.0
**Status**: 🚧 IN PROGRESS
**Start Date**: 2025-01-18

## Overview

Sprint 3 transitions from mock data and prototype functionality to production-ready implementation with real API integration, persistent storage, and enhanced algorithms.

## Sprint 3 Objectives

### Primary Goals
1. **Real API Integration** - Replace mock data with actual Swiss court decision APIs
2. **Database Layer** - Implement persistent storage for caching and performance
3. **Advanced Search** - Enhance search algorithms with ranking and semantic search
4. **Production Readiness** - Configure deployment, monitoring, and error handling

### Success Criteria
- ✅ Real-time access to Bundesgericht.ch and cantonal court decisions
- ✅ Database caching reduces API calls by >80%
- ✅ Search relevance score >90% for legal queries
- ✅ Production deployment configuration complete

## Architecture Evolution

### Sprint 2 → Sprint 3 Migration

**Current State (Sprint 2)**:
```
MCP Servers (TypeScript)
├── bge-search (mock data, stdio)
└── entscheidsuche (mock data, stdio)
```

**Target State (Sprint 3)**:
```
MCP Servers (TypeScript)
├── bge-search
│   ├── API Layer → bundesgericht.ch integration
│   ├── Cache Layer → PostgreSQL/SQLite
│   └── Search Engine → Relevance ranking
├── entscheidsuche
│   ├── API Layer → Cantonal court APIs
│   ├── Cache Layer → PostgreSQL/SQLite
│   └── Search Engine → Semantic search
└── shared/
    ├── database/ (connection, migrations, models)
    ├── api-clients/ (HTTP clients, rate limiting)
    └── search/ (ranking algorithms, NLP utils)
```

## Implementation Tasks

### 1. Real API Integration Layer

#### 1.1 Bundesgericht.ch API Client
**Objective**: Access real BGE decisions from official Swiss Federal Supreme Court API

**Tasks**:
- [ ] Research bundesgericht.ch API endpoints and authentication
- [ ] Implement HTTP client with rate limiting (max 10 req/sec)
- [ ] Create BGE decision parser for XML/JSON responses
- [ ] Add error handling for API timeouts and failures
- [ ] Implement retry logic with exponential backoff

**Files to Create**:
- `mcp-servers/shared/api-clients/bundesgericht-client.ts`
- `mcp-servers/shared/api-clients/rate-limiter.ts`
- `mcp-servers/shared/parsers/bge-parser.ts`

**Dependencies**:
- `axios` or `node-fetch` for HTTP requests
- `p-retry` for retry logic
- `bottleneck` for rate limiting

#### 1.2 Cantonal Court API Clients
**Objective**: Integrate with 6 major cantonal court systems

**Tasks**:
- [ ] Zürich (ZH): Implement ZH court decision API client
- [ ] Bern (BE): Implement BE court decision API client
- [ ] Geneva (GE): Implement GE court decision API client
- [ ] Basel-Stadt (BS): Implement BS court decision API client
- [ ] Vaud (VD): Implement VD court decision API client
- [ ] Ticino (TI): Implement TI court decision API client
- [ ] Create unified canton API interface
- [ ] Add fallback to web scraping if API unavailable

**Files to Create**:
- `mcp-servers/shared/api-clients/canton-client-zh.ts`
- `mcp-servers/shared/api-clients/canton-client-be.ts`
- `mcp-servers/shared/api-clients/canton-client-ge.ts`
- `mcp-servers/shared/api-clients/canton-client-bs.ts`
- `mcp-servers/shared/api-clients/canton-client-vd.ts`
- `mcp-servers/shared/api-clients/canton-client-ti.ts`
- `mcp-servers/shared/api-clients/canton-client-interface.ts`

### 2. Database Persistence Layer

#### 2.1 Database Setup
**Objective**: Implement PostgreSQL or SQLite for decision caching

**Tasks**:
- [ ] Choose database: PostgreSQL (production) vs SQLite (development)
- [ ] Design database schema for decisions, citations, search cache
- [ ] Create migration system (TypeORM or Knex.js)
- [ ] Implement connection pooling and error handling
- [ ] Add database initialization and seeding scripts

**Schema Design**:
```sql
-- BGE Decisions Table
CREATE TABLE bge_decisions (
  id UUID PRIMARY KEY,
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
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cantonal Decisions Table
CREATE TABLE cantonal_decisions (
  id UUID PRIMARY KEY,
  decision_id VARCHAR(50) UNIQUE NOT NULL,
  court_name VARCHAR(200),
  court_level VARCHAR(20),
  canton VARCHAR(2),
  title TEXT,
  date TIMESTAMP,
  language VARCHAR(2),
  summary TEXT,
  legal_areas TEXT[],
  reference_number VARCHAR(100),
  full_text TEXT,
  full_text_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Search Cache Table
CREATE TABLE search_cache (
  id UUID PRIMARY KEY,
  query_hash VARCHAR(64) UNIQUE NOT NULL,
  query_params JSONB,
  results JSONB,
  result_count INTEGER,
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Citation Network Table
CREATE TABLE citation_relationships (
  id UUID PRIMARY KEY,
  source_decision_id UUID NOT NULL,
  target_decision_id UUID NOT NULL,
  citation_context TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_decision_id, target_decision_id)
);

-- Indexes
CREATE INDEX idx_bge_citation ON bge_decisions(citation);
CREATE INDEX idx_bge_date ON bge_decisions(date DESC);
CREATE INDEX idx_bge_legal_areas ON bge_decisions USING GIN(legal_areas);
CREATE INDEX idx_cantonal_canton ON cantonal_decisions(canton);
CREATE INDEX idx_cantonal_date ON cantonal_decisions(date DESC);
CREATE INDEX idx_search_cache_hash ON search_cache(query_hash);
```

**Files to Create**:
- `mcp-servers/shared/database/connection.ts`
- `mcp-servers/shared/database/migrations/001_initial_schema.sql`
- `mcp-servers/shared/database/models/bge-decision.ts`
- `mcp-servers/shared/database/models/cantonal-decision.ts`
- `mcp-servers/shared/database/repositories/decision-repository.ts`

**Dependencies**:
- `pg` (PostgreSQL) or `better-sqlite3` (SQLite)
- `typeorm` or `knex` for query building and migrations
- `uuid` for ID generation

#### 2.2 Caching Strategy
**Objective**: Implement intelligent caching to reduce API calls

**Tasks**:
- [ ] Implement cache-first search strategy
- [ ] Add cache invalidation (TTL: 24 hours for decisions)
- [ ] Create cache warming for popular searches
- [ ] Add cache statistics and monitoring
- [ ] Implement LRU eviction for search cache

**Files to Create**:
- `mcp-servers/shared/cache/cache-manager.ts`
- `mcp-servers/shared/cache/cache-strategies.ts`

### 3. Advanced Search Algorithms

#### 3.1 Relevance Ranking
**Objective**: Rank search results by relevance to query

**Tasks**:
- [ ] Implement TF-IDF scoring for legal text
- [ ] Add BM25 ranking algorithm
- [ ] Create legal-specific term weighting (statutes, BGE citations boost)
- [ ] Implement recency bias (recent decisions score higher)
- [ ] Add canton-specific boosting based on user jurisdiction

**Algorithm Design**:
```typescript
interface SearchResult {
  decision: Decision;
  score: number;
  scoreBreakdown: {
    textRelevance: number;    // TF-IDF/BM25 score
    recencyBoost: number;      // Recent decisions boost
    jurisdictionBoost: number; // Canton match boost
    legalAreaMatch: number;    // Legal area exact match
    citationScore: number;     // Number of citations
  };
}

function rankResults(decisions: Decision[], query: string, userContext: UserContext): SearchResult[] {
  // Implement multi-factor ranking
}
```

**Files to Create**:
- `mcp-servers/shared/search/ranking-engine.ts`
- `mcp-servers/shared/search/tf-idf.ts`
- `mcp-servers/shared/search/bm25.ts`

**Dependencies**:
- `natural` for NLP and TF-IDF
- `stopword` for multi-language stopword removal

#### 3.2 Semantic Search (Optional Enhancement)
**Objective**: Enable meaning-based search beyond keyword matching

**Tasks**:
- [ ] Research vector embeddings for legal text (OpenAI, local models)
- [ ] Implement embedding generation for decisions
- [ ] Add vector similarity search (cosine similarity)
- [ ] Create hybrid search (keyword + semantic)

**Files to Create**:
- `mcp-servers/shared/search/semantic-search.ts`
- `mcp-servers/shared/search/embeddings.ts`

**Dependencies** (if implementing):
- `@huggingface/inference` or `openai` for embeddings
- `hnswlib-node` for vector search

### 4. Production Deployment Configuration

#### 4.1 Environment Configuration
**Objective**: Production-ready configuration management

**Tasks**:
- [ ] Create environment variable schema
- [ ] Add configuration validation
- [ ] Implement secret management (API keys, DB credentials)
- [ ] Create development, staging, production configs
- [ ] Add configuration documentation

**Files to Create**:
- `mcp-servers/.env.example`
- `mcp-servers/shared/config/config.ts`
- `mcp-servers/shared/config/env-validator.ts`

**Configuration Schema**:
```typescript
interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  database: {
    type: 'postgres' | 'sqlite';
    host?: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    poolSize: number;
  };
  apis: {
    bundesgericht: {
      baseUrl: string;
      apiKey?: string;
      rateLimit: number;
    };
    cantons: {
      [canton: string]: {
        baseUrl: string;
        apiKey?: string;
      };
    };
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
  };
}
```

#### 4.2 Error Handling & Logging
**Objective**: Comprehensive error tracking and debugging

**Tasks**:
- [ ] Implement structured logging (Winston or Pino)
- [ ] Add error categorization (API errors, DB errors, validation errors)
- [ ] Create error recovery strategies
- [ ] Add request/response logging for debugging
- [ ] Implement health check endpoints

**Files to Create**:
- `mcp-servers/shared/logging/logger.ts`
- `mcp-servers/shared/errors/error-types.ts`
- `mcp-servers/shared/errors/error-handler.ts`

**Dependencies**:
- `winston` or `pino` for logging
- `@sentry/node` (optional) for error tracking

#### 4.3 Monitoring & Metrics
**Objective**: Production observability

**Tasks**:
- [ ] Add performance metrics (query time, API latency)
- [ ] Implement usage tracking (queries per day, cache hit rate)
- [ ] Create health check endpoints
- [ ] Add database connection monitoring
- [ ] Implement API rate limit monitoring

**Files to Create**:
- `mcp-servers/shared/monitoring/metrics.ts`
- `mcp-servers/shared/monitoring/health-check.ts`

### 5. Testing & Quality Assurance

#### 5.1 Integration Tests
**Objective**: Test real API integration

**Tasks**:
- [ ] Create integration tests for Bundesgericht API
- [ ] Add integration tests for cantonal APIs
- [ ] Test database CRUD operations
- [ ] Test caching behavior
- [ ] Add E2E tests for complete workflows

**Files to Create**:
- `mcp-servers/bge-search/src/integration.test.ts`
- `mcp-servers/entscheidsuche/src/integration.test.ts`
- `mcp-servers/shared/database/database.test.ts`

#### 5.2 Performance Testing
**Objective**: Ensure production performance

**Tasks**:
- [ ] Benchmark search performance (target: <500ms per query)
- [ ] Test database query performance
- [ ] Load test API integration (concurrent requests)
- [ ] Test cache performance (hit rate >80%)

**Files to Create**:
- `mcp-servers/performance/benchmarks.ts`
- `mcp-servers/performance/load-tests.ts`

### 6. Documentation Updates

#### 6.1 API Documentation
**Tasks**:
- [ ] Document real API endpoints and authentication
- [ ] Create database schema documentation
- [ ] Document search ranking algorithm
- [ ] Add troubleshooting guide

**Files to Update/Create**:
- `docs/api-integration.md`
- `docs/database-schema.md`
- `docs/search-algorithms.md`
- `docs/troubleshooting.md`

#### 6.2 Deployment Guide
**Tasks**:
- [ ] Create production deployment guide
- [ ] Document database setup steps
- [ ] Add API key configuration guide
- [ ] Create backup and recovery procedures

**Files to Create**:
- `docs/deployment/production-setup.md`
- `docs/deployment/database-setup.md`
- `docs/deployment/backup-recovery.md`

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Focus**: Core infrastructure setup

1. Database layer implementation
2. Configuration management
3. Logging and error handling
4. Basic API client framework

**Deliverable**: Working database layer with migrations

### Phase 2: API Integration (Week 2)
**Focus**: Real data sources

1. Bundesgericht.ch API client
2. Cantonal API clients (prioritize ZH, GE, BE)
3. API error handling and retry logic
4. Integration tests

**Deliverable**: Real-time access to court decisions

### Phase 3: Search Enhancement (Week 3)
**Focus**: Search quality improvement

1. Relevance ranking implementation
2. Cache optimization
3. Search performance tuning
4. Citation network analysis

**Deliverable**: Production-quality search with ranking

### Phase 4: Production Readiness (Week 4)
**Focus**: Deployment and monitoring

1. Production configuration
2. Monitoring and metrics
3. Performance testing
4. Documentation completion

**Deliverable**: Production-ready system

## Technical Decisions

### Database Choice
**Decision**: PostgreSQL for production, SQLite for development
**Rationale**:
- PostgreSQL: Full-text search, JSONB support, production scalability
- SQLite: Easy development setup, no external dependencies
- Shared schema design works for both

### API Strategy
**Decision**: API-first with web scraping fallback
**Rationale**:
- Official APIs preferred for reliability
- Web scraping as backup for cantons without APIs
- Graceful degradation if APIs unavailable

### Caching Strategy
**Decision**: Database-backed cache with TTL
**Rationale**:
- Persistent across server restarts
- Efficient for repeated queries
- Reduces API load significantly

### Search Algorithm
**Decision**: TF-IDF/BM25 with legal-specific weighting
**Rationale**:
- Proven effectiveness for text search
- Customizable for legal terminology
- No external dependencies (vs vector search)

## Dependencies to Add

### Production Dependencies
```json
{
  "axios": "^1.6.0",           // HTTP client
  "pg": "^8.11.0",             // PostgreSQL client
  "better-sqlite3": "^9.2.0",  // SQLite client
  "typeorm": "^0.3.19",        // ORM and migrations
  "p-retry": "^6.1.0",         // Retry logic
  "bottleneck": "^2.19.5",     // Rate limiting
  "natural": "^6.10.0",        // NLP and TF-IDF
  "stopword": "^2.0.8",        // Stopword removal
  "winston": "^3.11.0",        // Logging
  "joi": "^17.11.0",           // Validation
  "uuid": "^9.0.1"             // UUID generation
}
```

### Development Dependencies
```json
{
  "@types/pg": "^8.10.0",
  "@types/better-sqlite3": "^7.6.0",
  "@types/natural": "^5.1.0",
  "nock": "^13.4.0"            // HTTP mocking for tests
}
```

## Risk Mitigation

### API Availability Risk
**Risk**: Court APIs may be unstable or unavailable
**Mitigation**:
- Implement robust error handling and retries
- Cache aggressively (24+ hour TTL)
- Web scraping fallback for critical cantons
- Monitor API uptime and alert on failures

### Performance Risk
**Risk**: Search may be slow with real data volume
**Mitigation**:
- Database indexing on all search columns
- Cache-first strategy reduces database load
- Pagination limits result set size
- Performance benchmarks before production

### Data Quality Risk
**Risk**: Court data may be inconsistent or incomplete
**Mitigation**:
- Validation layer for incoming API data
- Graceful handling of missing fields
- Data quality monitoring and alerts
- Manual review process for edge cases

## Success Metrics

### Performance
- [ ] Average search latency <500ms (90th percentile)
- [ ] Cache hit rate >80%
- [ ] API error rate <1%
- [ ] Database query time <100ms (90th percentile)

### Functionality
- [ ] Access to >10,000 real court decisions
- [ ] Search relevance score >90% (user feedback)
- [ ] All 6 major cantons integrated
- [ ] Citation network graph complete

### Quality
- [ ] Test coverage >80% for new code
- [ ] Zero critical bugs in production
- [ ] API uptime >99.5%
- [ ] Documentation completeness 100%

## Sprint 3 Deliverables

### Code Artifacts
1. ✅ Real API integration for Bundesgericht.ch
2. ✅ Cantonal API clients for 6 major cantons
3. ✅ PostgreSQL/SQLite database layer
4. ✅ Advanced search ranking engine
5. ✅ Production configuration system
6. ✅ Comprehensive error handling and logging
7. ✅ Integration and performance tests

### Documentation
1. ✅ API integration guide
2. ✅ Database schema documentation
3. ✅ Search algorithm documentation
4. ✅ Production deployment guide
5. ✅ Troubleshooting guide

### Infrastructure
1. ✅ Database migrations
2. ✅ Environment configuration
3. ✅ Monitoring and health checks
4. ✅ Backup and recovery procedures

## Next Steps After Sprint 3

### Sprint 4 Preview
- Advanced features (semantic search, ML ranking)
- Additional cantons (complete 26-canton coverage)
- Performance optimization (query caching, connection pooling)
- User feedback integration
- Commercial database plugins (swisslex, Weblaw)

## Notes

- Sprint 3 is critical for production readiness
- Real API integration may require iterative refinement
- Database design should support future enhancements
- Focus on stability and error handling over features
- Documentation is essential for maintainability

---

**Status**: 🚧 Implementation in progress
**Last Updated**: 2025-01-18
