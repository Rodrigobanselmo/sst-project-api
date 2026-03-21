import type { StreamEvent } from '../types/stream-events';

export interface DocumentAgentInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  companyId: string;
}

export async function* streamDocumentAgent(_input: DocumentAgentInput): AsyncGenerator<StreamEvent, void, undefined> {
  yield {
    type: 'content',
    content: 'O agente de documentos esta em desenvolvimento. Em breve voce podera gerar documentos por aqui!',
  };
}
