/**
 * Persona Activation Workflow Tests
 * Tests Persona → Mode → MCP activation logic
 */

import { describe, it, expect } from 'vitest';
import { PersonaActivator } from '../personas/persona-activator.js';

describe('PersonaActivator - Persona Registration', () => {
  const activator = new PersonaActivator();

  it('should register default personas', () => {
    const personas = activator.listPersonas();

    expect(personas).toHaveLength(3);
    expect(personas.map(p => p.name)).toContain('Legal Researcher');
    expect(personas.map(p => p.name)).toContain('Legal Drafter');
    expect(personas.map(p => p.name)).toContain('Case Strategist');
  });

  it('should register default modes', () => {
    const modes = activator.listModes();

    expect(modes).toHaveLength(4);
    expect(modes.map(m => m.name)).toContain('Legal Research Mode');
    expect(modes.map(m => m.name)).toContain('Multi-Lingual Mode');
    expect(modes.map(m => m.name)).toContain('Federal Law Mode');
    expect(modes.map(m => m.name)).toContain('Cantonal Law Mode');
  });
});

describe('PersonaActivator - Legal Researcher Persona', () => {
  const activator = new PersonaActivator();

  it('should activate Legal Researcher for "research" keyword', () => {
    const result = activator.activate('I need to research BGE decisions');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Researcher for "find" keyword', () => {
    const result = activator.activate('Find precedents on liability');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Researcher for "search" keyword', () => {
    const result = activator.activate('Search for case law');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Researcher for BGE citation', () => {
    const result = activator.activate('Analyze BGE 147 IV 73');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Researcher for ATF citation', () => {
    const result = activator.activate('Review ATF 145 II 113');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Researcher for "bundesgericht" keyword', () => {
    const result = activator.activate('Bundesgericht decisions on damages');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Researcher for "tribunal fédéral" keyword', () => {
    const result = activator.activate('Tribunal fédéral arrêts');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should select Legal Research Mode as default mode', () => {
    const result = activator.activate('Research case law');

    expect(result.mode).toBe('Legal Research Mode');
  });

  it('should suggest appropriate MCP servers', () => {
    const result = activator.activate('Find BGE decisions');

    expect(result.mcpServers).toContain('legal-citations');
    expect(result.mcpServers).toContain('bge-search');
    expect(result.mcpServers).toContain('entscheidsuche');
  });
});

describe('PersonaActivator - Legal Drafter Persona', () => {
  const activator = new PersonaActivator();

  it('should activate Legal Drafter for "draft" keyword', () => {
    const result = activator.activate('Draft a contract clause');

    expect(result.persona).toBe('Legal Drafter');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Drafter for "write" keyword', () => {
    const result = activator.activate('Write legal document');

    expect(result.persona).toBe('Legal Drafter');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Drafter for "create" keyword', () => {
    const result = activator.activate('Create agreement template');

    expect(result.persona).toBe('Legal Drafter');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Drafter for "contract" keyword', () => {
    const result = activator.activate('Review contract provisions');

    expect(result.persona).toBe('Legal Drafter');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Drafter for "statute" keyword', () => {
    const result = activator.activate('Cite relevant statute');

    expect(result.persona).toBe('Legal Drafter');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Legal Drafter for "article" keyword', () => {
    const result = activator.activate('Reference article provisions');

    expect(result.persona).toBe('Legal Drafter');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should select Multi-Lingual Mode as default mode', () => {
    const result = activator.activate('Draft contract');

    expect(result.mode).toBe('Multi-Lingual Mode');
  });

  it('should suggest legal-citations MCP server', () => {
    const result = activator.activate('Draft legal document');

    expect(result.mcpServers).toContain('legal-citations');
  });
});

describe('PersonaActivator - Case Strategist Persona', () => {
  const activator = new PersonaActivator();

  it('should activate Case Strategist for "strategy" keyword', () => {
    const result = activator.activate('Develop litigation strategy');

    expect(result.persona).toBe('Case Strategist');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Case Strategist for "argument" keyword', () => {
    const result = activator.activate('Build legal argument');

    expect(result.persona).toBe('Case Strategist');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Case Strategist for "analyze" keyword', () => {
    const result = activator.activate('Analyze liability issues');

    expect(result.persona).toBe('Case Strategist');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Case Strategist for "liability" keyword', () => {
    const result = activator.activate('Assess liability risks');

    expect(result.persona).toBe('Case Strategist');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Case Strategist for "damages" keyword', () => {
    const result = activator.activate('Calculate damages claim');

    expect(result.persona).toBe('Case Strategist');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should activate Case Strategist for "litigation" keyword', () => {
    const result = activator.activate('Prepare litigation documents');

    expect(result.persona).toBe('Case Strategist');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should select Federal Law Mode as default mode', () => {
    const result = activator.activate('Develop case strategy');

    expect(result.mode).toBe('Federal Law Mode');
  });

  it('should suggest appropriate MCP servers', () => {
    const result = activator.activate('Analyze case strategy');

    expect(result.mcpServers).toContain('bge-search');
    expect(result.mcpServers).toContain('legal-citations');
    expect(result.mcpServers).toContain('entscheidsuche');
  });
});

describe('PersonaActivator - Confidence Scoring', () => {
  const activator = new PersonaActivator();

  it('should have higher confidence with more keyword matches', () => {
    const singleKeyword = activator.activate('research');
    const multipleKeywords = activator.activate('research find search bge');

    expect(multipleKeywords.confidence).toBeGreaterThan(singleKeyword.confidence);
  });

  it('should score confidence based on keyword density', () => {
    const result = activator.activate('research find search locate discover bge atf');

    // Many matching keywords should yield high confidence
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('should cap confidence at 0.95', () => {
    const result = activator.activate('research find search locate discover bge atf precedent case law bundesgericht');

    expect(result.confidence).toBeLessThanOrEqual(0.95);
  });

  it('should return low confidence for non-matching messages', () => {
    const result = activator.activate('install npm packages');

    // Falls back to default persona with low confidence
    expect(result.confidence).toBeLessThan(0.5);
  });
});

describe('PersonaActivator - Explicit Persona Selection', () => {
  const activator = new PersonaActivator();

  it('should activate explicitly requested persona', () => {
    const result = activator.activate('some message', 'Legal Drafter');

    expect(result.persona).toBe('Legal Drafter');
    expect(result.confidence).toBe(1.0);
    expect(result.reason).toBe('Explicitly requested persona');
  });

  it('should activate correct mode for explicit persona', () => {
    const result = activator.activate('message', 'Case Strategist');

    expect(result.mode).toBe('Federal Law Mode');
  });

  it('should combine MCP servers from persona and mode', () => {
    const result = activator.activate('message', 'Case Strategist');

    // Case Strategist MCPs: bge-search, legal-citations, entscheidsuche
    // Federal Law Mode MCPs: bge-search, legal-citations, entscheidsuche
    expect(result.mcpServers).toContain('bge-search');
    expect(result.mcpServers).toContain('legal-citations');
    expect(result.mcpServers).toContain('entscheidsuche');
  });

  it('should ignore message content when explicit persona provided', () => {
    const result = activator.activate('draft contract', 'Legal Researcher');

    // Even though message suggests Legal Drafter, explicit request wins
    expect(result.persona).toBe('Legal Researcher');
  });
});

describe('PersonaActivator - Default Fallback Behavior', () => {
  const activator = new PersonaActivator();

  it('should fall back to Legal Researcher for non-matching messages', () => {
    const result = activator.activate('random unrelated message');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.mode).toBe('Legal Research Mode');
  });

  it('should have low confidence for fallback', () => {
    const result = activator.activate('install packages');

    expect(result.confidence).toBeLessThan(0.5);
  });

  it('should provide clear reason for fallback', () => {
    const result = activator.activate('unrelated content');

    expect(result.reason).toContain('Default persona');
  });

  it('should still provide MCP servers for fallback', () => {
    const result = activator.activate('random message');

    expect(result.mcpServers.length).toBeGreaterThan(0);
    expect(result.mcpServers).toContain('legal-citations');
  });
});

describe('PersonaActivator - MCP Server Aggregation', () => {
  const activator = new PersonaActivator();

  it('should deduplicate MCP servers from persona and mode', () => {
    const result = activator.activate('research case law');

    // Legal Researcher has: legal-citations, bge-search, entscheidsuche
    // Legal Research Mode has: legal-citations, bge-search, entscheidsuche
    // Should not have duplicates
    const uniqueServers = new Set(result.mcpServers);
    expect(uniqueServers.size).toBe(result.mcpServers.length);
  });

  it('should combine unique servers from both sources', () => {
    const result = activator.activate('draft contract');

    // Legal Drafter has: legal-citations
    // Multi-Lingual Mode has: legal-citations
    expect(result.mcpServers).toContain('legal-citations');
  });
});

describe('PersonaActivator - Persona Retrieval', () => {
  const activator = new PersonaActivator();

  it('should retrieve Legal Researcher persona config', () => {
    const persona = activator.getPersona('Legal Researcher');

    expect(persona).toBeDefined();
    expect(persona?.name).toBe('Legal Researcher');
    expect(persona?.defaultMode).toBe('Legal Research Mode');
    expect(persona?.triggerKeywords).toContain('research');
    expect(persona?.mcpServers).toContain('legal-citations');
  });

  it('should retrieve Legal Drafter persona config', () => {
    const persona = activator.getPersona('Legal Drafter');

    expect(persona).toBeDefined();
    expect(persona?.name).toBe('Legal Drafter');
    expect(persona?.defaultMode).toBe('Multi-Lingual Mode');
  });

  it('should retrieve Case Strategist persona config', () => {
    const persona = activator.getPersona('Case Strategist');

    expect(persona).toBeDefined();
    expect(persona?.name).toBe('Case Strategist');
    expect(persona?.defaultMode).toBe('Federal Law Mode');
  });

  it('should return undefined for non-existent persona', () => {
    const persona = activator.getPersona('Non-Existent Persona');

    expect(persona).toBeUndefined();
  });
});

describe('PersonaActivator - Mode Retrieval', () => {
  const activator = new PersonaActivator();

  it('should retrieve Legal Research Mode config', () => {
    const mode = activator.getMode('Legal Research Mode');

    expect(mode).toBeDefined();
    expect(mode?.name).toBe('Legal Research Mode');
    expect(mode?.mcpServers).toContain('legal-citations');
    expect(mode?.mcpServers).toContain('bge-search');
    expect(mode?.behaviors).toContain('Auto-validate all citations');
  });

  it('should retrieve Multi-Lingual Mode config', () => {
    const mode = activator.getMode('Multi-Lingual Mode');

    expect(mode).toBeDefined();
    expect(mode?.mcpServers).toContain('legal-citations');
    expect(mode?.behaviors).toContain('Auto-detect citation language');
  });

  it('should retrieve Federal Law Mode config', () => {
    const mode = activator.getMode('Federal Law Mode');

    expect(mode).toBeDefined();
    expect(mode?.mcpServers).toContain('bge-search');
    expect(mode?.behaviors).toContain('Focus on federal court decisions');
  });

  it('should retrieve Cantonal Law Mode config', () => {
    const mode = activator.getMode('Cantonal Law Mode');

    expect(mode).toBeDefined();
    expect(mode?.mcpServers).toContain('legal-citations');
    expect(mode?.behaviors).toContain('Validate cantonal citations');
  });

  it('should return undefined for non-existent mode', () => {
    const mode = activator.getMode('Non-Existent Mode');

    expect(mode).toBeUndefined();
  });
});

describe('PersonaActivator - Persona Capabilities', () => {
  const activator = new PersonaActivator();

  it('should define Legal Researcher capabilities', () => {
    const persona = activator.getPersona('Legal Researcher');

    expect(persona?.capabilities).toContain('Citation validation');
    expect(persona?.capabilities).toContain('BGE/ATF/DTF search');
    expect(persona?.capabilities).toContain('Federal court decision research');
  });

  it('should define Legal Drafter capabilities', () => {
    const persona = activator.getPersona('Legal Drafter');

    expect(persona?.capabilities).toContain('Statutory citation formatting');
    expect(persona?.capabilities).toContain('Multi-lingual document drafting');
    expect(persona?.capabilities).toContain('Citation conversion (DE/FR/IT/EN)');
  });

  it('should define Case Strategist capabilities', () => {
    const persona = activator.getPersona('Case Strategist');

    expect(persona?.capabilities).toContain('Precedent analysis');
    expect(persona?.capabilities).toContain('Case law research');
    expect(persona?.capabilities).toContain('Legal argumentation');
  });
});

describe('PersonaActivator - Mode Behaviors', () => {
  const activator = new PersonaActivator();

  it('should define Legal Research Mode behaviors', () => {
    const mode = activator.getMode('Legal Research Mode');

    expect(mode?.behaviors).toContain('Auto-validate all citations');
    expect(mode?.behaviors).toContain('Provide multi-lingual alternatives');
    expect(mode?.behaviors).toContain('Link to original decisions');
  });

  it('should define Multi-Lingual Mode behaviors', () => {
    const mode = activator.getMode('Multi-Lingual Mode');

    expect(mode?.behaviors).toContain('Auto-detect citation language');
    expect(mode?.behaviors).toContain('Provide all language translations');
    expect(mode?.behaviors).toContain('Maintain citation accuracy across languages');
  });

  it('should define Federal Law Mode behaviors', () => {
    const mode = activator.getMode('Federal Law Mode');

    expect(mode?.behaviors).toContain('Focus on federal court decisions');
    expect(mode?.behaviors).toContain('Validate statutory citations');
    expect(mode?.behaviors).toContain('Provide BGE/ATF/DTF precedents');
  });

  it('should define Cantonal Law Mode behaviors', () => {
    const mode = activator.getMode('Cantonal Law Mode');

    expect(mode?.behaviors).toContain('Validate cantonal citations');
    expect(mode?.behaviors).toContain('Apply canton-specific rules');
    expect(mode?.behaviors).toContain('Multi-jurisdictional comparison');
  });
});

describe('PersonaActivator - Case-Insensitive Matching', () => {
  const activator = new PersonaActivator();

  it('should match keywords case-insensitively', () => {
    const lowercase = activator.activate('research case law');
    const uppercase = activator.activate('RESEARCH CASE LAW');
    const mixed = activator.activate('ReSeArCh CaSe LaW');

    expect(lowercase.persona).toBe(uppercase.persona);
    expect(lowercase.persona).toBe(mixed.persona);
  });

  it('should normalize message for keyword matching', () => {
    const result = activator.activate('FIND BGE DECISIONS');

    expect(result.persona).toBe('Legal Researcher');
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});

describe('PersonaActivator - Activation Reason', () => {
  const activator = new PersonaActivator();

  it('should provide detected keywords in reason', () => {
    const result = activator.activate('research find bge');

    expect(result.reason).toContain('Detected keywords');
    expect(result.reason).toContain('research');
    expect(result.reason).toContain('find');
    expect(result.reason).toContain('bge');
  });

  it('should explain explicit activation', () => {
    const result = activator.activate('message', 'Legal Drafter');

    expect(result.reason).toBe('Explicitly requested persona');
  });

  it('should explain default fallback', () => {
    const result = activator.activate('unrelated message');

    expect(result.reason).toContain('Default persona');
    expect(result.reason).toContain('no strong match');
  });
});

describe('PersonaActivator - Multi-Keyword Scenarios', () => {
  const activator = new PersonaActivator();

  it('should handle messages with keywords from multiple personas', () => {
    // "research" for Legal Researcher, "draft" for Legal Drafter
    const result = activator.activate('research and draft legal document');

    // Should pick the persona with highest score
    expect(['Legal Researcher', 'Legal Drafter']).toContain(result.persona);
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should prioritize persona with more keyword matches', () => {
    // Multiple Legal Researcher keywords
    const result = activator.activate('research find search bge precedent draft');

    expect(result.persona).toBe('Legal Researcher');
  });

  it('should handle tie-breaking scenarios', () => {
    const result = activator.activate('research draft');

    // Both Legal Researcher and Legal Drafter match once
    // Should pick the first one evaluated or the one with better match strength
    expect(result.persona).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
  });
});
