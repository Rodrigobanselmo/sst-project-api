import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

export type LLMProvider = 'openai' | 'gemini';
export type AIMode = 'fast' | 'smarter';

export type OpenAIModel = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4.1-mini' | 'gpt-4.1' | 'o4-mini';
export type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-pro';

const DEFAULT_PROVIDER: LLMProvider = 'gemini';
const DEFAULT_AI_MODE: AIMode = 'fast';

const MODE_CONFIG: Record<AIMode, { openaiModel: OpenAIModel; geminiModel: GeminiModel; maxOutputTokens: number }> = {
  fast: {
    openaiModel: 'gpt-4o-mini',
    geminiModel: 'gemini-2.5-flash',
    maxOutputTokens: 4000, // Increased from 2000
  },
  smarter: {
    openaiModel: 'gpt-4o',
    geminiModel: 'gemini-2.5-pro',
    maxOutputTokens: 8000, // Increased from 4000
  },
};

export interface LlmConfig {
  mode?: AIMode;
  temperature?: number;
  maxOutputTokens?: number;
  provider?: LLMProvider;
}

@Injectable()
export class LlmFactory {
  create(config: LlmConfig = {}): BaseChatModel {
    const { mode = DEFAULT_AI_MODE, temperature, maxOutputTokens, provider = DEFAULT_PROVIDER } = config;

    const modeConfig = MODE_CONFIG[mode];
    const finalMaxOutputTokens = maxOutputTokens ?? modeConfig.maxOutputTokens;

    // Log LangSmith configuration
    const langsmithEnabled = process.env.LANGCHAIN_TRACING_V2 === 'true';
    if (langsmithEnabled) {
      console.log(`[LangSmith] ✅ Tracing enabled - Project: ${process.env.LANGCHAIN_PROJECT || 'default'}`);
    } else {
      console.log('[LangSmith] ⚠️  Tracing disabled - Set LANGCHAIN_TRACING_V2=true to enable');
    }

    switch (provider) {
      case 'openai': {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY is not configured.');
        }

        const openaiConfig = {
          model: modeConfig.openaiModel,
          ...(temperature !== undefined && { temperature }),
          maxTokens: finalMaxOutputTokens,
        };

        console.log(
          `[LLM] Creating OpenAI instance - Mode: ${mode}, Model: ${openaiConfig.model}, MaxTokens: ${openaiConfig.maxTokens}${temperature !== undefined ? `, Temperature: ${temperature}` : ''}`,
        );

        return new ChatOpenAI({ ...openaiConfig, apiKey });
      }

      case 'gemini': {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          throw new Error('GOOGLE_API_KEY is not configured.');
        }

        const geminiConfig = {
          model: modeConfig.geminiModel,
          ...(temperature !== undefined && { temperature }),
          maxOutputTokens: finalMaxOutputTokens,
          streaming: true,
        };

        console.log(
          `[LLM] Creating Gemini instance - Mode: ${mode}, Model: ${geminiConfig.model}, MaxTokens: ${geminiConfig.maxOutputTokens}${temperature !== undefined ? `, Temperature: ${temperature}` : ''}`,
        );

        return new ChatGoogleGenerativeAI({ ...geminiConfig, apiKey });
      }

      default:
        throw new Error(`Unknown LLM provider: ${provider as string}`);
    }
  }
}
