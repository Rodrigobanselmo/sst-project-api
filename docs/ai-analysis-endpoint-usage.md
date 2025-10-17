# AI Analysis Endpoint Usage

## Overview

The AI Analysis endpoint allows you to analyze content (text, images, or both) using AI for characterization purposes. This is a generic adapter that can handle various types of analysis requests with mixed content types.

## Endpoint

```
POST /v2/companies/:companyId/workspaces/:workspaceId/characterizations/ai/analyze-images
```

## Authentication

Requires JWT authentication and the following permissions:
- Permission: `CHARACTERIZATION`
- Contract access: `true`
- Member access: `true`
- CRUD access: `true`

## Request Parameters

### Path Parameters
- `companyId` (string): The company identifier
- `workspaceId` (string): The workspace identifier

### Request Body

```typescript
{
  imageUrls: string[];           // Array of image URLs to analyze (required)
  prompt: string;                // Analysis prompt/instructions (required)
  language?: string;             // Language for response (default: 'pt-BR')
  additionalContext?: string;    // Optional additional context
  responseFormat?: 'text' | 'json'; // Response format (default: 'text')
  maxTokens?: number;           // Max tokens for response (100-4000, default: 1000)
}
```

## Example Requests

### Basic Safety Analysis

```bash
curl -X POST \
  "https://api.example.com/v2/companies/comp-123/workspaces/ws-456/characterizations/ai/analyze-images" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": [
      "https://example.com/safety-image1.jpg",
      "https://example.com/safety-image2.jpg"
    ],
    "prompt": "Analise estas imagens de segurança do trabalho e identifique os principais riscos e recomendações de segurança.",
    "language": "pt-BR",
    "additionalContext": "Análise de canteiro de obras de construção civil",
    "responseFormat": "text",
    "maxTokens": 1500
  }'
```

### Structured JSON Response

```bash
curl -X POST \
  "https://api.example.com/v2/companies/comp-123/workspaces/ws-456/characterizations/ai/analyze-images" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": [
      "https://example.com/equipment-image.jpg"
    ],
    "prompt": "Analyze this equipment image and return a JSON response with the following structure: {\"equipment_type\": \"string\", \"safety_risks\": [\"string\"], \"recommendations\": [\"string\"], \"compliance_status\": \"compliant|non_compliant|needs_review\"}",
    "responseFormat": "json",
    "maxTokens": 2000
  }'
```

## Response Format

```typescript
{
  analysis: string;              // The AI analysis result
  confidence: number;            // Confidence score (0-1)
  metadata?: {                   // Additional metadata
    model: string;               // AI model used
    imageCount: number;          // Number of images analyzed
    responseFormat: string;      // Format used
    companyId: string;           // Company ID
    workspaceId: string;         // Workspace ID
    timestamp: string;           // Analysis timestamp
    // ... other metadata
  }
}
```

## Example Response

```json
{
  "analysis": "Análise das imagens de segurança:\n\n1. **Riscos Identificados:**\n   - Trabalhadores sem capacete de segurança\n   - Ausência de equipamentos de proteção individual (EPIs)\n   - Materiais mal organizados no canteiro\n\n2. **Recomendações:**\n   - Implementar uso obrigatório de capacetes\n   - Fornecer treinamento sobre EPIs\n   - Organizar materiais de forma segura",
  "confidence": 0.85,
  "metadata": {
    "model": "gpt-4o",
    "imageCount": 2,
    "responseFormat": "text",
    "companyId": "comp-123",
    "workspaceId": "ws-456",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Responses

### Validation Errors

```json
{
  "statusCode": 400,
  "message": "At least one image URL is required",
  "error": "Bad Request"
}
```

### Invalid Image URLs

```json
{
  "statusCode": 400,
  "message": "Invalid image URLs: invalid-url, another-invalid-url",
  "error": "Bad Request"
}
```

### AI Service Error

```json
{
  "statusCode": 400,
  "message": "Failed to analyze images: OPENAI_API_KEY not configured",
  "error": "Bad Request"
}
```

## Use Cases

1. **Safety Risk Assessment**: Analyze workplace images to identify safety hazards
2. **Equipment Inspection**: Evaluate equipment condition and compliance
3. **Environmental Analysis**: Assess environmental conditions and risks
4. **Compliance Verification**: Check adherence to safety standards
5. **Training Material Analysis**: Evaluate training scenarios and situations

## Best Practices

1. **Image Quality**: Use high-resolution images for better analysis
2. **Clear Prompts**: Provide specific, detailed prompts for better results
3. **Context**: Include relevant context to improve analysis accuracy
4. **Token Limits**: Adjust maxTokens based on expected response length
5. **Error Handling**: Implement proper error handling for API failures
