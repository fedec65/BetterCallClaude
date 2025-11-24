/**
 * Type definitions for BetterCallClaude command system
 */

/**
 * Command execution context
 */
export interface CommandContext {
  /** Command arguments (positional) */
  args: string[];

  /** Command flags (--key value) */
  flags: Record<string, string | boolean>;

  /** User message that triggered the command */
  userMessage: string;

  /** Detected language from user message */
  detectedLanguage?: 'de' | 'fr' | 'it' | 'en';

  /** Active persona (if any) */
  activePersona?: string;

  /** Active mode (if any) */
  activeMode?: string;
}

/**
 * Command execution result
 */
export interface CommandResult {
  /** Success status */
  success: boolean;

  /** Result data (if successful) */
  data?: any;

  /** User-facing message */
  message?: string;

  /** Error message (if failed) */
  error?: string;

  /** Verbose output (optional) */
  verbose?: any;

  /** Metadata for logging/tracking */
  metadata?: {
    executionTime?: number;
    mcpCalls?: number;
    tokensUsed?: number;
  };
}

/**
 * Command handler function
 */
export type CommandHandler = (context: CommandContext) => Promise<CommandResult>;

/**
 * Command metadata for help/documentation
 */
export interface CommandMetadata {
  description: string;
  usage: string;
  examples: string[];
  flags: Record<string, string>;
}
