/**
 * Legal Citation Slash Commands for BetterCallClaude Framework
 * Provides /legal:validate, /legal:format, /legal:convert, /legal:parse commands
 */

import type { CommandHandler, CommandContext, CommandResult } from '../types/command-types.js';

/**
 * Legal citation command registry
 */
export class LegalCommands {
  private mcpClient: any; // MCP client for legal-citations server

  constructor(mcpClient: any) {
    this.mcpClient = mcpClient;
  }

  /**
   * /legal:validate - Validate a Swiss legal citation
   */
  async handleValidate(context: CommandContext): Promise<CommandResult> {
    const { args, flags } = context;

    if (!args[0]) {
      return {
        success: false,
        error: 'Citation required. Usage: /legal:validate "BGE 147 IV 73"'
      };
    }

    const citation = args[0];

    try {
      // Call MCP legal-citations server validate_citation tool
      const result = await this.mcpClient.callTool('legal-citations', 'validate_citation', {
        citation
      });

      const validationData = JSON.parse(result.content[0].text);

      if (validationData.valid) {
        return {
          success: true,
          data: {
            citation: validationData.normalized || citation,
            type: validationData.type,
            components: validationData.components,
            warnings: validationData.warnings
          },
          message: `✅ Valid ${validationData.type.toUpperCase()} citation: ${validationData.normalized || citation}`
        };
      } else {
        return {
          success: false,
          error: `❌ Invalid citation: ${validationData.errors?.join(', ') || 'Unknown error'}`,
          data: { errors: validationData.errors }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to validate citation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * /legal:format - Format a citation to target language
   */
  async handleFormat(context: CommandContext): Promise<CommandResult> {
    const { args, flags } = context;

    if (!args[0]) {
      return {
        success: false,
        error: 'Citation required. Usage: /legal:format "BGE 147 IV 73" --lang fr'
      };
    }

    const citation = args[0];
    const targetLanguage = flags.lang || flags.language || 'de';

    if (!['de', 'fr', 'it', 'en'].includes(targetLanguage)) {
      return {
        success: false,
        error: `Invalid language: ${targetLanguage}. Supported: de, fr, it, en`
      };
    }

    try {
      // Call MCP legal-citations server format_citation tool
      const result = await this.mcpClient.callTool('legal-citations', 'format_citation', {
        citation,
        targetLanguage,
        fullStatuteName: flags.full || false
      });

      const formatData = JSON.parse(result.content[0].text);

      return {
        success: true,
        data: {
          original: formatData.original,
          formatted: formatData.formatted,
          language: formatData.language,
          type: formatData.type
        },
        message: `📝 Formatted to ${targetLanguage.toUpperCase()}: ${formatData.formatted}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to format citation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * /legal:convert - Convert citation between languages with all translations
   */
  async handleConvert(context: CommandContext): Promise<CommandResult> {
    const { args, flags } = context;

    if (!args[0]) {
      return {
        success: false,
        error: 'Citation required. Usage: /legal:convert "Art. 97 OR" --lang fr'
      };
    }

    const citation = args[0];
    const targetLanguage = flags.lang || flags.language || 'fr';

    if (!['de', 'fr', 'it', 'en'].includes(targetLanguage)) {
      return {
        success: false,
        error: `Invalid language: ${targetLanguage}. Supported: de, fr, it, en`
      };
    }

    try {
      // Call MCP legal-citations server convert_citation tool
      const result = await this.mcpClient.callTool('legal-citations', 'convert_citation', {
        citation,
        targetLanguage
      });

      const convertData = JSON.parse(result.content[0].text);

      return {
        success: true,
        data: {
          original: convertData.original,
          sourceLanguage: convertData.sourceLanguage,
          targetLanguage: convertData.targetLanguage,
          converted: convertData.converted,
          allTranslations: flags.all ? convertData.allTranslations : undefined
        },
        message: `🌐 ${convertData.sourceLanguage.toUpperCase()} → ${convertData.targetLanguage.toUpperCase()}: ${convertData.converted}`,
        verbose: flags.all ? true : undefined
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to convert citation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * /legal:parse - Parse citation and extract all components
   */
  async handleParse(context: CommandContext): Promise<CommandResult> {
    const { args, flags } = context;

    if (!args[0]) {
      return {
        success: false,
        error: 'Citation required. Usage: /legal:parse "Art. 97 Abs. 1 lit. a OR"'
      };
    }

    const citation = args[0];

    try {
      // Call MCP legal-citations server parse_citation tool
      const result = await this.mcpClient.callTool('legal-citations', 'parse_citation', {
        citation
      });

      const parseData = JSON.parse(result.content[0].text);

      return {
        success: true,
        data: {
          original: parseData.original,
          type: parseData.type,
          language: parseData.language,
          components: parseData.components,
          isValid: parseData.isValid
        },
        message: `🔍 Parsed ${parseData.type.toUpperCase()} citation (${parseData.language.toUpperCase()})`,
        verbose: parseData.components
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse citation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Register all legal commands with the framework
   */
  registerCommands(registry: Map<string, CommandHandler>): void {
    registry.set('legal:validate', this.handleValidate.bind(this));
    registry.set('legal:format', this.handleFormat.bind(this));
    registry.set('legal:convert', this.handleConvert.bind(this));
    registry.set('legal:parse', this.handleParse.bind(this));
  }
}

/**
 * Command metadata for help and documentation
 */
export const LEGAL_COMMAND_METADATA = {
  'legal:validate': {
    description: 'Validate a Swiss legal citation (BGE/ATF/DTF or statutory)',
    usage: '/legal:validate "BGE 147 IV 73"',
    examples: [
      '/legal:validate "BGE 147 IV 73"',
      '/legal:validate "Art. 97 OR"',
      '/legal:validate "ATF 145 II 113"'
    ],
    flags: {}
  },
  'legal:format': {
    description: 'Format a citation to target language (DE/FR/IT/EN)',
    usage: '/legal:format "BGE 147 IV 73" --lang fr',
    examples: [
      '/legal:format "BGE 147 IV 73" --lang fr',
      '/legal:format "Art. 97 OR" --lang it --full',
      '/legal:format "ATF 145 II 113" --language en'
    ],
    flags: {
      lang: 'Target language (de|fr|it|en)',
      language: 'Alias for --lang',
      full: 'Include full statute name'
    }
  },
  'legal:convert': {
    description: 'Convert citation between languages with all translations',
    usage: '/legal:convert "Art. 97 Abs. 1 OR" --lang fr',
    examples: [
      '/legal:convert "Art. 97 OR" --lang fr',
      '/legal:convert "BGE 147 IV 73" --lang it --all',
      '/legal:convert "art. 97 CO" --lang de'
    ],
    flags: {
      lang: 'Target language (de|fr|it|en)',
      language: 'Alias for --lang',
      all: 'Show all language translations'
    }
  },
  'legal:parse': {
    description: 'Parse citation and extract all components',
    usage: '/legal:parse "Art. 97 Abs. 1 lit. a OR"',
    examples: [
      '/legal:parse "BGE 147 IV 73"',
      '/legal:parse "Art. 97 Abs. 1 lit. a Ziff. 2 OR"',
      '/legal:parse "ATF 145 II 113"'
    ],
    flags: {}
  }
};
