import OpenAI from 'openai';
import { AiAdapter, AiAnalysisResult } from './ai.interface';

// Types for OpenAI message content with cache control
type OpenAITextContent = {
  type: 'text';
  text: string;
  cache_control?: {
    type: 'ephemeral';
  };
};

type OpenAIImageContent = {
  type: 'image_url';
  image_url: {
    url: string;
    detail: 'low' | 'high' | 'auto';
  };
  cache_control?: {
    type: 'ephemeral';
  };
};

export class OpenAIAiAdapter implements AiAdapter {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = process.env.OPENAI_MODEL || 'o4-mini' || 'gpt-4.1' || 'gpt-4o';
  }

  async analyze({ content, prompt, language = 'pt-BR', additionalContext, responseFormat = 'text', systemPrompt, model }: AiAdapter.AnalyzeParams): Promise<AiAnalysisResult> {
    if (!this.client.apiKey) throw new Error('OPENAI_API_KEY not configured');

    // Build the system message
    const defaultSystemPrompt = `Você é um assistente especialista em análise para SST (Segurança e Saúde no Trabalho). Responda em ${language}.${additionalContext ? ` Contexto adicional: ${additionalContext}` : ''}`;
    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;

    // Build the messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: finalSystemPrompt,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          ...content.map((item): OpenAITextContent | OpenAIImageContent => {
            if (item.type === 'text') {
              const textItem: OpenAITextContent = {
                type: 'text' as const,
                text: item.text || '',
              };

              // Add cache control if specified
              if (item.cache_control) {
                textItem.cache_control = item.cache_control;
              }

              return textItem;
            } else if (item.type === 'image_url' && item.image_url) {
              const imageItem: OpenAIImageContent = {
                type: 'image_url' as const,
                image_url: {
                  url: item.image_url.url,
                  detail: item.image_url.detail || ('high' as const),
                },
              };

              // Add cache control if specified
              if (item.cache_control) {
                imageItem.cache_control = item.cache_control;
              }

              return imageItem;
            }
            throw new Error(`Unsupported content type: ${item.type}`);
          }),
        ],
      },
    ];

    try {
      // Prepare the request parameters
      const requestParams: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
        model: model || this.model, // Use provided model or fallback to default
        messages,
      };

      // Handle structured outputs
      if (typeof responseFormat === 'object' && responseFormat.type === 'json_schema') {
        requestParams.response_format = {
          type: 'json_schema',
          json_schema: responseFormat.json_schema,
        };
      } else if (responseFormat === 'json') {
        requestParams.response_format = { type: 'json_object' };
      }

      const response = await this.client.chat.completions.create(requestParams);

      const analysis = response.choices[0]?.message?.content || 'Não foi possível realizar a análise.';

      // Handle structured outputs
      if (typeof responseFormat === 'object' && responseFormat.type === 'json_schema') {
        try {
          const parsedAnalysis = JSON.parse(analysis);
          return {
            analysis: JSON.stringify(parsedAnalysis, null, 2),
            confidence: 0.9, // Higher confidence for structured outputs
            metadata: {
              model: model || this.model,
              contentItems: content.length,
              responseFormat: 'structured_output',
              schema: responseFormat.json_schema.name,
              parsedData: parsedAnalysis,
            },
          };
        } catch (error) {
          throw new Error(`Failed to parse structured output: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Try to parse as JSON if responseFormat is 'json'
      if (responseFormat === 'json') {
        try {
          const parsedAnalysis = JSON.parse(analysis);
          return {
            analysis: JSON.stringify(parsedAnalysis, null, 2),
            confidence: 0.8,
            metadata: {
              model: model || this.model,
              contentItems: content.length,
              responseFormat: 'json',
              parsedData: parsedAnalysis,
            },
          };
        } catch {
          // If JSON parsing fails, return as text
          return {
            analysis,
            confidence: 0.6,
            metadata: {
              model: model || this.model,
              contentItems: content.length,
              responseFormat: 'json_failed',
              note: 'Failed to parse as JSON, returned as text',
            },
          };
        }
      }

      return {
        analysis,
        confidence: 0.8,
        metadata: {
          model: model || this.model,
          contentItems: content.length,
          responseFormat: 'text',
        },
      };
    } catch (error) {
      throw new Error(`Failed to analyze content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
