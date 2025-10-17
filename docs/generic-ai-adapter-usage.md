# Generic AI Adapter Usage

## Overview

The AI adapter now provides a single, generic `analyze` method that can handle any combination of text and images. This makes it extremely flexible for various analysis scenarios.

## Interface

```typescript
interface AiAdapter {
  analyze(params: AiAdapter.AnalyzeParams): Promise<AiAnalysisResult>;
}

type AiContentItem = {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
};

type AnalyzeParams = {
  content: AiContentItem[]; // Array of content items (text and/or images)
  prompt: string; // Analysis prompt/instructions
  language?: string; // e.g., 'pt-BR' | 'en'
  additionalContext?: string; // Optional additional context
  responseFormat?: 'text' | 'json'; // Expected response format
  maxTokens?: number; // Maximum tokens for response
  systemPrompt?: string; // Optional custom system prompt
};
```

## Usage Examples

### 1. Text-Only Analysis (Traditional Characterization)

```typescript
import { AiContentBuilders } from '@/@v2/shared/adapters/ai/helpers/content-builders';

const result = await aiAdapter.analyze({
  content: AiContentBuilders.forCharacterization('Descrição da caracterização do ambiente de trabalho...'),
  prompt: 'Analise esta caracterização e identifique os principais riscos e recomendações de segurança.',
  language: 'pt-BR',
  responseFormat: 'json'
});
```

### 2. Image-Only Analysis

```typescript
const result = await aiAdapter.analyze({
  content: AiContentBuilders.forImageAnalysis([
    'https://example.com/workplace1.jpg',
    'https://example.com/workplace2.jpg'
  ]),
  prompt: 'Analise estas imagens do local de trabalho e identifique riscos de segurança.',
  language: 'pt-BR'
});
```

### 3. Mixed Content Analysis (Text + Images)

```typescript
const result = await aiAdapter.analyze({
  content: AiContentBuilders.forMixedAnalysis(
    'Este é um canteiro de obras com as seguintes características...',
    ['https://example.com/site1.jpg', 'https://example.com/site2.jpg']
  ),
  prompt: 'Analise o texto descritivo junto com as imagens para uma avaliação completa de riscos.',
  language: 'pt-BR',
  additionalContext: 'Construção civil - edifício residencial'
});
```

### 4. Custom Content Building

```typescript
const content = [
  AiContentBuilders.text('Relatório de inspeção:'),
  AiContentBuilders.text('- Área: Produção'),
  AiContentBuilders.text('- Data: 2024-01-15'),
  AiContentBuilders.image('https://example.com/inspection1.jpg', 'high'),
  AiContentBuilders.text('Observações adicionais:'),
  AiContentBuilders.image('https://example.com/inspection2.jpg', 'high')
];

const result = await aiAdapter.analyze({
  content,
  prompt: 'Analise este relatório de inspeção completo.',
  responseFormat: 'json'
});
```

### 5. Structured JSON Response

```typescript
const result = await aiAdapter.analyze({
  content: AiContentBuilders.forImageAnalysis(['https://example.com/equipment.jpg']),
  prompt: `Analise este equipamento e retorne um JSON com a seguinte estrutura:
  {
    "equipment_type": "string",
    "safety_status": "safe|unsafe|needs_inspection",
    "identified_risks": ["string"],
    "recommendations": ["string"],
    "compliance_issues": ["string"]
  }`,
  responseFormat: 'json',
  maxTokens: 2000
});

// The result.analysis will contain the JSON string
const parsedData = JSON.parse(result.analysis);
```

## Helper Functions

The `AiContentBuilders` class provides convenient methods:

```typescript
// Single text item
AiContentBuilders.text('Some text content')

// Single image item
AiContentBuilders.image('https://example.com/image.jpg', 'high')

// Multiple images
AiContentBuilders.images(['url1.jpg', 'url2.jpg'], 'high')

// Mixed content
AiContentBuilders.mixed([
  { type: 'text', text: 'Description' },
  { type: 'image', url: 'image.jpg', detail: 'high' }
])

// Predefined helpers
AiContentBuilders.forCharacterization('text content')
AiContentBuilders.forImageAnalysis(['image1.jpg', 'image2.jpg'])
AiContentBuilders.forMixedAnalysis('text', ['image1.jpg'], 'high')
```

## Migration from Old Methods

### Old analyzeCharacterization:
```typescript
// OLD
const result = await aiAdapter.analyzeCharacterization({
  content: 'characterization text',
  language: 'pt-BR'
});

// NEW
const result = await aiAdapter.analyze({
  content: AiContentBuilders.forCharacterization('characterization text'),
  prompt: 'Analise esta caracterização e gere um resumo, riscos e recomendações.',
  language: 'pt-BR'
});
```

### Old analyzeImages:
```typescript
// OLD
const result = await aiAdapter.analyzeImages({
  imageUrls: ['image1.jpg', 'image2.jpg'],
  prompt: 'Analyze these images',
  language: 'pt-BR'
});

// NEW
const result = await aiAdapter.analyze({
  content: AiContentBuilders.forImageAnalysis(['image1.jpg', 'image2.jpg']),
  prompt: 'Analyze these images',
  language: 'pt-BR'
});
```

## Benefits of the Generic Approach

1. **Unified Interface**: Single method for all analysis types
2. **Mixed Content**: Can combine text and images in one request
3. **Flexible**: Easy to add new content types in the future
4. **Type Safe**: Full TypeScript support with proper types
5. **Helper Functions**: Convenient builders for common scenarios
6. **Backward Compatible**: Easy migration path from old methods
