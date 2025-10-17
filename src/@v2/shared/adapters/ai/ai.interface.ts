export type AiAnalysisResult = {
  analysis: string;
  confidence: number; // 0..1
  metadata?: Record<string, any>;
};

export type AiContentItem = {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
  cache_control?: {
    type: 'ephemeral';
  };
};

export interface AiAdapter {
  analyze(params: AiAdapter.AnalyzeParams): Promise<AiAnalysisResult>;
}

export type StructuredOutputSchema = {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, any>;
  };
};

export namespace AiAdapter {
  export type AnalyzeParams = {
    content: AiContentItem[]; // Array of content items (text and/or images)
    prompt: string; // Analysis prompt/instructions
    language?: string; // e.g., 'pt-BR' | 'en'
    additionalContext?: string; // Optional additional context for analysis
    responseFormat?: 'text' | 'json' | StructuredOutputSchema; // Expected response format
    systemPrompt?: string; // Optional custom system prompt
    model?: string; // Optional model to use (e.g., 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo')
  };
}
