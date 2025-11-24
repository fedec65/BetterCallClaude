/**
 * Persona Activation System for BetterCallClaude Framework
 * Manages persona → mode → MCP server activation workflows
 */

export interface PersonaConfig {
  name: string;
  triggerKeywords: string[];
  defaultMode: string;
  mcpServers: string[];
  capabilities: string[];
}

export interface ModeConfig {
  name: string;
  description: string;
  mcpServers: string[];
  behaviors: string[];
}

export interface ActivationResult {
  persona: string;
  mode: string;
  mcpServers: string[];
  confidence: number;
  reason: string;
}

/**
 * Persona activation engine
 */
export class PersonaActivator {
  private personas: Map<string, PersonaConfig> = new Map();
  private modes: Map<string, ModeConfig> = new Map();

  constructor() {
    this.registerDefaultPersonas();
    this.registerDefaultModes();
  }

  /**
   * Register default legal personas
   */
  private registerDefaultPersonas(): void {
    // Legal Researcher Persona
    this.personas.set('Legal Researcher', {
      name: 'Legal Researcher',
      triggerKeywords: [
        'research', 'find', 'search', 'locate', 'discover',
        'bge', 'atf', 'dtf', 'precedent', 'case law',
        'bundesgericht', 'tribunal fédéral', 'tribunale federale'
      ],
      defaultMode: 'Legal Research Mode',
      mcpServers: ['legal-citations', 'bge-search', 'entscheidsuche'],
      capabilities: [
        'Citation validation',
        'BGE/ATF/DTF search',
        'Federal court decision research',
        'Multi-lingual citation formatting'
      ]
    });

    // Legal Drafter Persona
    this.personas.set('Legal Drafter', {
      name: 'Legal Drafter',
      triggerKeywords: [
        'draft', 'write', 'create', 'compose',
        'contract', 'agreement', 'document',
        'statute', 'law', 'regulation',
        'article', 'paragraph', 'section'
      ],
      defaultMode: 'Multi-Lingual Mode',
      mcpServers: ['legal-citations'],
      capabilities: [
        'Statutory citation formatting',
        'Multi-lingual document drafting',
        'Citation conversion (DE/FR/IT/EN)',
        'Legal reference validation'
      ]
    });

    // Case Strategist Persona
    this.personas.set('Case Strategist', {
      name: 'Case Strategist',
      triggerKeywords: [
        'strategy', 'argument', 'analyze', 'assess',
        'liability', 'damages', 'claim',
        'defense', 'prosecution', 'litigation'
      ],
      defaultMode: 'Federal Law Mode',
      mcpServers: ['bge-search', 'legal-citations', 'entscheidsuche'],
      capabilities: [
        'Precedent analysis',
        'Case law research',
        'Legal argumentation',
        'Multi-jurisdictional analysis'
      ]
    });
  }

  /**
   * Register default legal modes
   */
  private registerDefaultModes(): void {
    // Legal Research Mode
    this.modes.set('Legal Research Mode', {
      name: 'Legal Research Mode',
      description: 'Comprehensive legal research with citation validation and case law discovery',
      mcpServers: ['legal-citations', 'bge-search', 'entscheidsuche'],
      behaviors: [
        'Auto-validate all citations',
        'Provide multi-lingual alternatives',
        'Link to original decisions',
        'Cross-reference related cases'
      ]
    });

    // Multi-Lingual Mode
    this.modes.set('Multi-Lingual Mode', {
      name: 'Multi-Lingual Mode',
      description: 'Multi-lingual document drafting with citation conversion (DE/FR/IT/EN)',
      mcpServers: ['legal-citations'],
      behaviors: [
        'Auto-detect citation language',
        'Provide all language translations',
        'Maintain citation accuracy across languages',
        'Apply language-specific formatting rules'
      ]
    });

    // Federal Law Mode
    this.modes.set('Federal Law Mode', {
      name: 'Federal Law Mode',
      description: 'Swiss federal law analysis with BGE precedent integration',
      mcpServers: ['bge-search', 'legal-citations', 'entscheidsuche'],
      behaviors: [
        'Focus on federal court decisions',
        'Validate statutory citations',
        'Provide BGE/ATF/DTF precedents',
        'Multi-chamber analysis'
      ]
    });

    // Cantonal Law Mode
    this.modes.set('Cantonal Law Mode', {
      name: 'Cantonal Law Mode',
      description: 'Cantonal law research with jurisdiction-specific analysis',
      mcpServers: ['legal-citations'],
      behaviors: [
        'Validate cantonal citations',
        'Apply canton-specific rules',
        'Multi-jurisdictional comparison',
        'Hierarchical law analysis'
      ]
    });
  }

  /**
   * Activate persona based on user message
   */
  activate(message: string, explicitPersona?: string): ActivationResult {
    const normalizedMessage = message.toLowerCase();

    // If explicit persona provided, use it
    if (explicitPersona && this.personas.has(explicitPersona)) {
      const persona = this.personas.get(explicitPersona)!;
      const mode = this.modes.get(persona.defaultMode)!;

      return {
        persona: persona.name,
        mode: mode.name,
        mcpServers: [...new Set([...persona.mcpServers, ...mode.mcpServers])],
        confidence: 1.0,
        reason: 'Explicitly requested persona'
      };
    }

    // Auto-detect persona from message
    let bestMatch: { persona: PersonaConfig; score: number } | null = null;

    for (const [name, persona] of this.personas.entries()) {
      const score = this.calculatePersonaScore(normalizedMessage, persona);
      if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { persona, score };
      }
    }

    if (bestMatch) {
      const persona = bestMatch.persona;
      const mode = this.modes.get(persona.defaultMode)!;

      return {
        persona: persona.name,
        mode: mode.name,
        mcpServers: [...new Set([...persona.mcpServers, ...mode.mcpServers])],
        confidence: bestMatch.score,
        reason: `Detected keywords: ${persona.triggerKeywords.filter(kw => normalizedMessage.includes(kw)).join(', ')}`
      };
    }

    // Default to Legal Researcher
    const defaultPersona = this.personas.get('Legal Researcher')!;
    const defaultMode = this.modes.get(defaultPersona.defaultMode)!;

    return {
      persona: defaultPersona.name,
      mode: defaultMode.name,
      mcpServers: [...new Set([...defaultPersona.mcpServers, ...defaultMode.mcpServers])],
      confidence: 0.3,
      reason: 'Default persona (no strong match detected)'
    };
  }

  /**
   * Calculate persona relevance score
   */
  private calculatePersonaScore(message: string, persona: PersonaConfig): number {
    // Message is already lowercase from activate() method
    const matchingKeywords = persona.triggerKeywords.filter(kw =>
      message.includes(kw)
    );

    if (matchingKeywords.length === 0) return 0.0;

    // Calculate base score: 1 match = 0.6, 2 matches = 0.75, 3+ matches = 0.85+
    const baseStrength = Math.min(0.5 + (matchingKeywords.length * 0.15), 0.95);

    // Bonus for domain-specific legal citation keywords (BGE, ATF, DTF, court names)
    // These should be strongly favored as they indicate specific legal research needs
    const citationKeywords = ['bge', 'atf', 'dtf', 'bundesgericht', 'tribunal fédéral', 'tribunale federale'];
    const hasCitationKeyword = matchingKeywords.some(kw => citationKeywords.includes(kw));
    const citationBonus = hasCitationKeyword ? 0.15 : 0.0;

    // Bonus for longer keywords (more specific terms) - but only if no citation bonus
    // This helps with "litigation" > "document" but doesn't interfere with citation priority
    const lengthBonus = !hasCitationKeyword ?
      Math.min((matchingKeywords.reduce((sum, kw) => sum + kw.length, 0) / matchingKeywords.length - 5) * 0.015, 0.08) : 0.0;

    return Math.min(baseStrength + citationBonus + lengthBonus, 0.95);
  }

  /**
   * Get persona configuration
   */
  getPersona(name: string): PersonaConfig | undefined {
    return this.personas.get(name);
  }

  /**
   * Get mode configuration
   */
  getMode(name: string): ModeConfig | undefined {
    return this.modes.get(name);
  }

  /**
   * List all available personas
   */
  listPersonas(): PersonaConfig[] {
    return Array.from(this.personas.values());
  }

  /**
   * List all available modes
   */
  listModes(): ModeConfig[] {
    return Array.from(this.modes.values());
  }
}
