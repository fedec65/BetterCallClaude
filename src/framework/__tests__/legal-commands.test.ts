/**
 * Framework Command Handler Tests
 * Tests /legal: slash commands integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LegalCommands } from '../commands/legal-commands.js';
import type { CommandContext } from '../types/command-types.js';

describe('Legal Commands - Framework Integration', () => {
  let legalCommands: LegalCommands;
  let mockMCPClient: any;

  beforeEach(() => {
    // Mock MCP client
    mockMCPClient = {
      callTool: vi.fn()
    };

    legalCommands = new LegalCommands(mockMCPClient);
  });

  describe('/legal:validate Command', () => {
    it('should validate BGE citation successfully', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            valid: true,
            type: 'bge',
            normalized: 'BGE 147 IV 73',
            components: { volume: '147', chamber: 'IV', page: '73' }
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: {},
        userMessage: '/legal:validate "BGE 147 IV 73"'
      };

      const result = await legalCommands.handleValidate(context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('bge');
      expect(result.data?.citation).toBe('BGE 147 IV 73');
      expect(result.message).toContain('Valid BGE citation');

      expect(mockMCPClient.callTool).toHaveBeenCalledWith(
        'legal-citations',
        'validate_citation',
        { citation: 'BGE 147 IV 73' }
      );
    });

    it('should reject invalid citation', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            valid: false,
            type: 'unknown',
            errors: ['Invalid citation format']
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['INVALID 123'],
        flags: {},
        userMessage: '/legal:validate "INVALID 123"'
      };

      const result = await legalCommands.handleValidate(context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid citation');
    });

    it('should require citation argument', async () => {
      const context: CommandContext = {
        args: [],
        flags: {},
        userMessage: '/legal:validate'
      };

      const result = await legalCommands.handleValidate(context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Citation required');
    });

    it('should validate statutory citations', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            valid: true,
            type: 'statute',
            normalized: 'Art. 97 OR',
            components: { statute: 'OR', article: '97' }
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['Art. 97 OR'],
        flags: {},
        userMessage: '/legal:validate "Art. 97 OR"'
      };

      const result = await legalCommands.handleValidate(context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('statute');
    });
  });

  describe('/legal:format Command', () => {
    it('should format BGE to French (ATF)', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'BGE 147 IV 73',
            formatted: 'ATF 147 IV 73',
            language: 'fr',
            type: 'court'
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: { lang: 'fr' },
        userMessage: '/legal:format "BGE 147 IV 73" --lang fr'
      };

      const result = await legalCommands.handleFormat(context);

      expect(result.success).toBe(true);
      expect(result.data?.formatted).toBe('ATF 147 IV 73');
      expect(result.data?.language).toBe('fr');
      expect(result.message).toContain('Formatted to FR');

      expect(mockMCPClient.callTool).toHaveBeenCalledWith(
        'legal-citations',
        'format_citation',
        {
          citation: 'BGE 147 IV 73',
          targetLanguage: 'fr',
          fullStatuteName: false
        }
      );
    });

    it('should format statute to Italian', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'Art. 97 OR',
            formatted: 'art. 97 CO',
            language: 'it',
            type: 'statute'
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['Art. 97 OR'],
        flags: { language: 'it' }, // Test 'language' alias
        userMessage: '/legal:format "Art. 97 OR" --language it'
      };

      const result = await legalCommands.handleFormat(context);

      expect(result.success).toBe(true);
      expect(result.data?.formatted).toBe('art. 97 CO');
    });

    it('should default to German language', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'BGE 147 IV 73',
            formatted: 'BGE 147 IV 73',
            language: 'de',
            type: 'court'
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: {}, // No language specified
        userMessage: '/legal:format "BGE 147 IV 73"'
      };

      const result = await legalCommands.handleFormat(context);

      expect(result.success).toBe(true);
      expect(mockMCPClient.callTool).toHaveBeenCalledWith(
        'legal-citations',
        'format_citation',
        expect.objectContaining({ targetLanguage: 'de' })
      );
    });

    it('should reject invalid language code', async () => {
      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: { lang: 'es' }, // Spanish not supported
        userMessage: '/legal:format "BGE 147 IV 73" --lang es'
      };

      const result = await legalCommands.handleFormat(context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid language');
    });

    it('should support --full flag for statute names', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'Art. 97 OR',
            formatted: 'Art. 97 OR (Obligationenrecht)',
            language: 'de',
            type: 'statute'
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['Art. 97 OR'],
        flags: { full: true },
        userMessage: '/legal:format "Art. 97 OR" --full'
      };

      const result = await legalCommands.handleFormat(context);

      expect(mockMCPClient.callTool).toHaveBeenCalledWith(
        'legal-citations',
        'format_citation',
        expect.objectContaining({ fullStatuteName: true })
      );
    });
  });

  describe('/legal:convert Command', () => {
    it('should convert with all translations', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'Art. 97 Abs. 1 OR',
            sourceLanguage: 'de',
            targetLanguage: 'fr',
            converted: 'art. 97 al. 1 CO',
            allTranslations: {
              de: 'Art. 97 Abs. 1 OR',
              fr: 'art. 97 al. 1 CO',
              it: 'art. 97 cpv. 1 CO',
              en: 'Art. 97 para. 1 CO'
            }
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['Art. 97 Abs. 1 OR'],
        flags: { lang: 'fr' },
        userMessage: '/legal:convert "Art. 97 Abs. 1 OR" --lang fr'
      };

      const result = await legalCommands.handleConvert(context);

      expect(result.success).toBe(true);
      expect(result.data?.converted).toBe('art. 97 al. 1 CO');
      expect(result.data?.sourceLanguage).toBe('de');
      expect(result.data?.targetLanguage).toBe('fr');
      // Without --all flag, allTranslations should be undefined
      expect(result.data?.allTranslations).toBeUndefined();
    });

    it('should show all translations with --all flag', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'BGE 147 IV 73',
            sourceLanguage: 'de',
            targetLanguage: 'fr',
            converted: 'ATF 147 IV 73',
            allTranslations: {
              de: 'BGE 147 IV 73',
              fr: 'ATF 147 IV 73',
              it: 'DTF 147 IV 73',
              en: 'BGE 147 IV 73'
            }
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: { lang: 'fr', all: true },
        userMessage: '/legal:convert "BGE 147 IV 73" --lang fr --all'
      };

      const result = await legalCommands.handleConvert(context);

      expect(result.success).toBe(true);
      expect(result.verbose).toBeDefined();
      expect(result.verbose).toEqual(mockResponse.content[0].text.includes('allTranslations'));
    });
  });

  describe('/legal:parse Command', () => {
    it('should parse complete statutory citation', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'Art. 97 Abs. 1 lit. a Ziff. 2 OR',
            type: 'statute',
            language: 'de',
            components: {
              statute: 'OR',
              article: '97',
              paragraph: '1',
              letter: 'a',
              number: '2'
            },
            isValid: true
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['Art. 97 Abs. 1 lit. a Ziff. 2 OR'],
        flags: {},
        userMessage: '/legal:parse "Art. 97 Abs. 1 lit. a Ziff. 2 OR"'
      };

      const result = await legalCommands.handleParse(context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('statute');
      expect(result.data?.language).toBe('de');
      expect(result.data?.components).toEqual({
        statute: 'OR',
        article: '97',
        paragraph: '1',
        letter: 'a',
        number: '2'
      });
    });

    it('should parse BGE citation components', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: JSON.stringify({
            original: 'BGE 147 IV 73',
            type: 'bge',
            language: 'de',
            components: {
              volume: '147',
              chamber: 'IV',
              page: '73'
            },
            isValid: true
          })
        }]
      };

      mockMCPClient.callTool.mockResolvedValue(mockResponse);

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: {},
        userMessage: '/legal:parse "BGE 147 IV 73"'
      };

      const result = await legalCommands.handleParse(context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('bge');
      expect(result.data?.components?.volume).toBe('147');
      expect(result.data?.components?.chamber).toBe('IV');
      expect(result.data?.components?.page).toBe('73');
    });
  });

  describe('Command Registration', () => {
    it('should register all 4 legal commands', () => {
      const registry = new Map<string, any>();
      legalCommands.registerCommands(registry);

      expect(registry.size).toBe(4);
      expect(registry.has('legal:validate')).toBe(true);
      expect(registry.has('legal:format')).toBe(true);
      expect(registry.has('legal:convert')).toBe(true);
      expect(registry.has('legal:parse')).toBe(true);
    });

    it('should register working command handlers', async () => {
      const registry = new Map<string, any>();
      legalCommands.registerCommands(registry);

      const validateHandler = registry.get('legal:validate');
      expect(typeof validateHandler).toBe('function');

      // Mock response for validation
      mockMCPClient.callTool.mockResolvedValue({
        content: [{
          type: 'text',
          text: JSON.stringify({ valid: true, type: 'bge' })
        }]
      });

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: {},
        userMessage: '/legal:validate "BGE 147 IV 73"'
      };

      const result = await validateHandler(context);
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle MCP client errors gracefully', async () => {
      mockMCPClient.callTool.mockRejectedValue(new Error('MCP server unavailable'));

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: {},
        userMessage: '/legal:validate "BGE 147 IV 73"'
      };

      const result = await legalCommands.handleValidate(context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to validate citation');
      expect(result.error).toContain('MCP server unavailable');
    });

    it('should handle malformed MCP responses', async () => {
      mockMCPClient.callTool.mockResolvedValue({
        content: [{ type: 'text', text: 'invalid json' }]
      });

      const context: CommandContext = {
        args: ['BGE 147 IV 73'],
        flags: {},
        userMessage: '/legal:validate "BGE 147 IV 73"'
      };

      const result = await legalCommands.handleValidate(context);

      expect(result.success).toBe(false);
    });
  });
});
