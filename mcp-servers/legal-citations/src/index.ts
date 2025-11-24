#!/usr/bin/env node

/**
 * Legal Citations MCP Server
 * Provides citation verification and multi-lingual formatting for Swiss law
 *
 * @see https://modelcontextprotocol.io/
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

import { CitationValidator } from './validators/citation-validator.js';
import { CitationFormatter } from './formatters/citation-formatter.js';
import { CitationParser } from './parsers/citation-parser.js';
import type { Language, FormatOptions } from './types.js';

/**
 * MCP Server for Swiss Legal Citations
 * Version: 1.0.0
 */
class LegalCitationsMCPServer {
  private server: Server;
  private validator: CitationValidator;
  private formatter: CitationFormatter;
  private parser: CitationParser;

  constructor() {
    this.server = new Server(
      {
        name: 'legal-citations',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.validator = new CitationValidator();
    this.formatter = new CitationFormatter();
    this.parser = new CitationParser();

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'validate_citation',
          description: 'Validate a Swiss legal citation (BGE/ATF/DTF or statutory). Returns validation result with normalized citation and error messages if invalid.',
          inputSchema: {
            type: 'object',
            properties: {
              citation: {
                type: 'string',
                description: 'The legal citation to validate (e.g., "BGE 147 IV 73", "Art. 97 OR")'
              }
            },
            required: ['citation']
          }
        },
        {
          name: 'format_citation',
          description: 'Format a Swiss legal citation to a specific language (DE/FR/IT/EN). Converts citation components while preserving legal meaning.',
          inputSchema: {
            type: 'object',
            properties: {
              citation: {
                type: 'string',
                description: 'The legal citation to format'
              },
              targetLanguage: {
                type: 'string',
                enum: ['de', 'fr', 'it', 'en'],
                description: 'Target language for formatting (de=German, fr=French, it=Italian, en=English)'
              },
              fullStatuteName: {
                type: 'boolean',
                description: 'Include full statute name in parentheses (optional, default: false)',
                default: false
              }
            },
            required: ['citation', 'targetLanguage']
          }
        },
        {
          name: 'convert_citation',
          description: 'Convert a citation from one language to another. Auto-detects source language and converts to target language.',
          inputSchema: {
            type: 'object',
            properties: {
              citation: {
                type: 'string',
                description: 'The legal citation to convert'
              },
              targetLanguage: {
                type: 'string',
                enum: ['de', 'fr', 'it', 'en'],
                description: 'Target language (de=German, fr=French, it=Italian, en=English)'
              },
              fullStatuteName: {
                type: 'boolean',
                description: 'Include full statute name (optional, default: false)',
                default: false
              }
            },
            required: ['citation', 'targetLanguage']
          }
        },
        {
          name: 'parse_citation',
          description: 'Parse a Swiss legal citation and extract all components. Returns citation type, language, components, and validity status.',
          inputSchema: {
            type: 'object',
            properties: {
              citation: {
                type: 'string',
                description: 'The legal citation to parse'
              }
            },
            required: ['citation']
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'validate_citation':
            return await this.handleValidateCitation(args);

          case 'format_citation':
            return await this.handleFormatCitation(args);

          case 'convert_citation':
            return await this.handleConvertCitation(args);

          case 'parse_citation':
            return await this.handleParseCitation(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${errorMessage}`
        );
      }
    });
  }

  private async handleValidateCitation(args: any) {
    const { citation } = args;

    if (!citation || typeof citation !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Citation parameter is required and must be a string'
      );
    }

    const result = this.validator.validate(citation);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              valid: result.valid,
              type: result.type,
              normalized: result.normalized,
              components: result.components,
              errors: result.errors,
              warnings: result.warnings
            },
            null,
            2
          )
        }
      ]
    };
  }

  private async handleFormatCitation(args: any) {
    const { citation, targetLanguage, fullStatuteName = false } = args;

    if (!citation || typeof citation !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Citation parameter is required and must be a string'
      );
    }

    if (!targetLanguage || !['de', 'fr', 'it', 'en'].includes(targetLanguage)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'targetLanguage must be one of: de, fr, it, en'
      );
    }

    // Parse citation first
    const parsed = this.parser.parse(citation);

    if (!parsed.isValid) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid citation: ${citation}`
      );
    }

    // Format to target language
    const options: FormatOptions = {
      language: targetLanguage as Language,
      fullStatuteName
    };

    const formatted = this.formatter.format(
      parsed.type,
      parsed.components,
      targetLanguage as Language,
      options
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              original: citation,
              formatted: formatted.citation,
              language: formatted.language,
              type: formatted.type,
              fullReference: formatted.fullReference
            },
            null,
            2
          )
        }
      ]
    };
  }

  private async handleConvertCitation(args: any) {
    const { citation, targetLanguage, fullStatuteName = false } = args;

    if (!citation || typeof citation !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Citation parameter is required and must be a string'
      );
    }

    if (!targetLanguage || !['de', 'fr', 'it', 'en'].includes(targetLanguage)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'targetLanguage must be one of: de, fr, it, en'
      );
    }

    // Parse and detect source language
    const parsed = this.parser.parse(citation);

    if (!parsed.isValid) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid citation: ${citation}`
      );
    }

    // Get all translations
    const allTranslations = this.formatter.getAllTranslations(
      parsed.type,
      parsed.components
    );

    // Format to target language with options
    const options: FormatOptions = {
      language: targetLanguage as Language,
      fullStatuteName
    };

    const formatted = this.formatter.format(
      parsed.type,
      parsed.components,
      targetLanguage as Language,
      options
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              original: citation,
              sourceLanguage: parsed.language,
              targetLanguage,
              converted: formatted.citation,
              fullReference: formatted.fullReference,
              allTranslations
            },
            null,
            2
          )
        }
      ]
    };
  }

  private async handleParseCitation(args: any) {
    const { citation } = args;

    if (!citation || typeof citation !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Citation parameter is required and must be a string'
      );
    }

    const parsed = this.parser.parse(citation);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              original: parsed.original,
              type: parsed.type,
              language: parsed.language,
              components: parsed.components,
              isValid: parsed.isValid,
              suggestions: parsed.suggestions
            },
            null,
            2
          )
        }
      ]
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error('Legal Citations MCP server running on stdio');
    console.error('Version: 1.0.0');
    console.error('Capabilities: validate_citation, format_citation, convert_citation, parse_citation');
  }
}

// Start the server
const server = new LegalCitationsMCPServer();
server.run().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
