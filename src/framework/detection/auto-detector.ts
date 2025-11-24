/**
 * Auto-detection engine for BetterCallClaude Framework
 * Detects legal citations, queries, and user intent to activate appropriate MCP servers
 */

/**
 * Detection result with confidence scoring
 */
export interface DetectionResult {
  /** Type of content detected */
  type: 'citation' | 'legal_query' | 'statute_reference' | 'case_law' | 'none';

  /** Confidence score (0-1) */
  confidence: number;

  /** Detected language */
  language?: 'de' | 'fr' | 'it' | 'en';

  /** Detected citations */
  citations?: string[];

  /** Suggested MCP servers to activate */
  suggestedMCPs?: string[];

  /** Suggested persona */
  suggestedPersona?: string;

  /** Suggested mode */
  suggestedMode?: string;

  /** Extracted entities */
  entities?: {
    courts?: string[];
    statutes?: string[];
    articles?: string[];
    cantons?: string[];
  };
}

/**
 * Auto-detection engine
 */
export class AutoDetector {
  // Citation patterns
  private static readonly BGE_PATTERN = /BGE\s+\d{1,3}\s+[IVX]+\s+\d+/gi;
  private static readonly ATF_PATTERN = /ATF\s+\d{1,3}\s+[IVX]+\s+\d+/gi;
  private static readonly DTF_PATTERN = /DTF\s+\d{1,3}\s+[IVX]+\s+\d+/gi;
  private static readonly STATUTE_PATTERN = /Art\.\s*\d+[a-z]?(?:\s+(?:Abs|al|cpv)\.\s*\d+)?(?:\s+(?:lit|let|lett)\.\s*[a-z])?(?:\s+(?:Ziff|ch|n)\.\s*\d+)?\s+(?:ZGB|CC|OR|CO|StGB|CP|StPO|CPP|ZPO|CPC|BV|Cst|Cost|SchKG|LP|LEF|DSG|LPD)/gi;

  // Legal query keywords (all lowercase for matching)
  private static readonly LEGAL_KEYWORDS_DE = [
    'validate', 'validieren', 'überprüfen',
    'format', 'formatieren',
    'convert', 'konvertieren', 'übersetzen',
    'parse', 'analysieren',
    'citation', 'zitat', 'verweis',
    'urteil', 'entscheid', 'bundesgericht',
    'gesetz', 'artikel', 'absatz',
    'find', 'search', 'locate',
    'liability', 'haftung', 'decision', 'decisions'
  ];

  private static readonly LEGAL_KEYWORDS_FR = [
    'valider', 'vérifier',
    'formater',
    'convertir', 'traduire',
    'analyser',
    'citation', 'référence',
    'arrêt', 'décision', 'tribunal fédéral',
    'loi', 'article', 'alinéa'
  ];

  private static readonly LEGAL_KEYWORDS_IT = [
    'validare', 'verificare',
    'formattare',
    'convertire', 'tradurre',
    'analizzare',
    'citazione', 'riferimento',
    'sentenza', 'decisione', 'tribunale federale',
    'legge', 'articolo', 'capoverso'
  ];

  // Swiss courts
  private static readonly SWISS_COURTS = [
    'bundesgericht', 'tribunal fédéral', 'tribunale federale',
    'BGer', 'TF', 'DTF',
    'kantonsgericht', 'tribunal cantonal', 'tribunale cantonale',
    'obergericht', 'cour suprême', 'corte suprema'
  ];

  // Swiss statutes (common abbreviations)
  private static readonly SWISS_STATUTES = [
    'ZGB', 'CC', 'OR', 'CO', 'StGB', 'CP', 'StPO', 'CPP',
    'ZPO', 'CPC', 'BV', 'Cst', 'Cost', 'SchKG', 'LP', 'LEF',
    'DSG', 'LPD', 'URG', 'LDA', 'PatG', 'LBI', 'MSchG', 'LPM'
  ];

  /**
   * Detect legal content in user message
   */
  detect(message: string): DetectionResult {
    const normalizedMessage = message.toLowerCase();

    // Check for explicit citations (highest priority)
    const citations = this.extractCitations(message);
    if (citations.length > 0) {
      return {
        type: 'citation',
        confidence: 0.95,
        language: this.detectLanguage(message),
        citations,
        suggestedMCPs: ['legal-citations'],
        suggestedPersona: 'Legal Researcher',
        suggestedMode: 'Legal Research Mode'
      };
    }

    // Check for court references (more specific than keywords)
    const hasCourts = this.containsCourts(normalizedMessage);
    if (hasCourts) {
      return {
        type: 'case_law',
        confidence: 0.75,
        language: this.detectLanguage(message),
        suggestedMCPs: ['legal-citations', 'bge-search', 'entscheidsuche'],
        suggestedPersona: 'Legal Researcher',
        suggestedMode: 'Federal Law Mode',
        entities: this.extractEntities(message)
      };
    }

    // Check for statute references (more specific than keywords)
    const hasStatutes = this.containsStatutes(normalizedMessage);
    if (hasStatutes) {
      return {
        type: 'statute_reference',
        confidence: 0.80,
        language: this.detectLanguage(message),
        suggestedMCPs: ['legal-citations'],
        suggestedPersona: 'Legal Drafter',
        suggestedMode: 'Federal Law Mode',
        entities: this.extractEntities(message)
      };
    }

    // Check for legal query keywords (broader, check last)
    const hasLegalKeywords = this.containsLegalKeywords(normalizedMessage);
    if (hasLegalKeywords.confidence > 0.5) {
      return {
        type: 'legal_query',
        confidence: hasLegalKeywords.confidence,
        language: hasLegalKeywords.language,
        suggestedMCPs: ['legal-citations', 'bge-search', 'entscheidsuche'],
        suggestedPersona: 'Legal Researcher',
        suggestedMode: 'Legal Research Mode',
        entities: this.extractEntities(message)
      };
    }

    // No legal content detected
    // But still extract any entities present for partial matches
    const entities = this.extractEntities(message);
    const hasEntities = entities.courts?.length || entities.statutes?.length || entities.articles?.length;

    return {
      type: 'none',
      confidence: 0.0,
      entities: hasEntities ? entities : undefined
    };
  }

  /**
   * Extract all citations from text
   */
  private extractCitations(text: string): string[] {
    const citations: string[] = [];

    // Extract BGE citations
    const bgeMatches = text.match(AutoDetector.BGE_PATTERN);
    if (bgeMatches) citations.push(...bgeMatches);

    // Extract ATF citations
    const atfMatches = text.match(AutoDetector.ATF_PATTERN);
    if (atfMatches) citations.push(...atfMatches);

    // Extract DTF citations
    const dtfMatches = text.match(AutoDetector.DTF_PATTERN);
    if (dtfMatches) citations.push(...dtfMatches);

    // Extract statute citations
    const statuteMatches = text.match(AutoDetector.STATUTE_PATTERN);
    if (statuteMatches) citations.push(...statuteMatches);

    return citations;
  }

  /**
   * Check if message contains legal keywords
   */
  private containsLegalKeywords(message: string): { confidence: number; language?: 'de' | 'fr' | 'it' | 'en' } {
    let matchCount = 0;
    let totalKeywords = 0;
    let detectedLanguage: 'de' | 'fr' | 'it' | 'en' | undefined;

    // Check German keywords (message is already lowercase from detect())
    const deMatches = AutoDetector.LEGAL_KEYWORDS_DE.filter(kw => message.includes(kw));
    if (deMatches.length > 0) {
      matchCount += deMatches.length;
      totalKeywords = AutoDetector.LEGAL_KEYWORDS_DE.length;
      detectedLanguage = 'de';
    }

    // Check French keywords
    const frMatches = AutoDetector.LEGAL_KEYWORDS_FR.filter(kw => message.includes(kw));
    if (frMatches.length > deMatches.length) {
      matchCount = frMatches.length;
      totalKeywords = AutoDetector.LEGAL_KEYWORDS_FR.length;
      detectedLanguage = 'fr';
    }

    // Check Italian keywords
    const itMatches = AutoDetector.LEGAL_KEYWORDS_IT.filter(kw => message.includes(kw));
    if (itMatches.length > Math.max(deMatches.length, frMatches.length)) {
      matchCount = itMatches.length;
      totalKeywords = AutoDetector.LEGAL_KEYWORDS_IT.length;
      detectedLanguage = 'it';
    }

    const confidence = matchCount > 0 ? Math.min(0.5 + (matchCount / totalKeywords), 0.95) : 0.0;

    return { confidence, language: detectedLanguage };
  }

  /**
   * Check if message contains Swiss court references
   */
  private containsCourts(message: string): boolean {
    return AutoDetector.SWISS_COURTS.some(court => message.includes(court.toLowerCase()));
  }

  /**
   * Check if message contains statute references
   */
  private containsStatutes(message: string): boolean {
    return AutoDetector.SWISS_STATUTES.some(statute =>
      message.includes(statute.toLowerCase()) || message.includes(statute)
    );
  }

  /**
   * Detect language from message (returns undefined if no clear indicators)
   */
  private detectLanguage(message: string): 'de' | 'fr' | 'it' | 'en' | undefined {
    const normalized = message.toLowerCase();

    // German indicators
    if (normalized.includes('abs.') || normalized.includes('lit.') || normalized.includes('ziff.') ||
        normalized.includes('bundesgericht') || normalized.includes('bge')) {
      return 'de';
    }

    // French indicators
    if (normalized.includes(' al. ') || normalized.includes(' let. ') || normalized.includes(' ch. ') ||
        normalized.includes('tribunal fédéral') || normalized.includes('atf')) {
      return 'fr';
    }

    // Italian indicators
    if (normalized.includes('cpv.') || normalized.includes('lett.') || normalized.includes(' n. ') ||
        normalized.includes('tribunale federale') || normalized.includes('dtf')) {
      return 'it';
    }

    // Return undefined when no clear language indicators (don't default to 'de')
    return undefined;
  }

  /**
   * Extract entities (courts, statutes, articles, cantons)
   */
  private extractEntities(message: string): {
    courts?: string[];
    statutes?: string[];
    articles?: string[];
    cantons?: string[];
  } {
    const entities: any = {};

    // Extract courts
    const courts = AutoDetector.SWISS_COURTS.filter(court =>
      message.toLowerCase().includes(court.toLowerCase())
    );
    if (courts.length > 0) entities.courts = courts;

    // Extract statutes
    const statutes = AutoDetector.SWISS_STATUTES.filter(statute =>
      message.includes(statute)
    );
    if (statutes.length > 0) entities.statutes = statutes;

    // Extract article numbers - capture the number only, not "Art."
    const articlePattern = /Art\.\s*(\d+[a-z]?)/gi;
    let match;
    const articles: string[] = [];
    while ((match = articlePattern.exec(message)) !== null) {
      articles.push(match[1]); // Capture group 1 = just the number
    }
    if (articles.length > 0) entities.articles = articles;

    return entities;
  }
}
