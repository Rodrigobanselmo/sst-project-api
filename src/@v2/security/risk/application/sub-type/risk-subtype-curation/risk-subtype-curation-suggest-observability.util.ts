import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type RiskSubtypeSuggestStage =
  | 'validation'
  | 'db'
  | 'enrichment'
  | 'prompt'
  | 'openai'
  | 'normalize'
  | 'response';

export function extractSuggestErrorMeta(error: unknown): {
  message: string;
  code?: string;
  status?: number;
} {
  if (error instanceof Error) {
    const maybeHttp = error as Error & {
      status?: number;
      response?: { status?: number };
    };
    const status = maybeHttp.status ?? maybeHttp.response?.status;
    const code =
      error.message === 'AI_TIMEOUT'
        ? 'AI_TIMEOUT'
        : status
          ? String(status)
          : undefined;

    return {
      message: error.message,
      code,
      status,
    };
  }

  return { message: 'Erro desconhecido na sugestão de subtipo.' };
}

export class RiskSubtypeSuggestObservability {
  readonly requestId = randomUUID();
  private readonly startedAt = Date.now();
  private stage: RiskSubtypeSuggestStage = 'validation';

  constructor(private readonly logger: Logger) {}

  setStage(stage: RiskSubtypeSuggestStage): void {
    this.stage = stage;
  }

  getStage(): RiskSubtypeSuggestStage {
    return this.stage;
  }

  elapsedMs(): number {
    return Date.now() - this.startedAt;
  }

  log(event: string, fields: Record<string, unknown> = {}): void {
    this.logger.log(
      JSON.stringify({
        event,
        requestId: this.requestId,
        ...fields,
      }),
    );
  }

  logError(error: unknown): void {
    const meta = extractSuggestErrorMeta(error);
    this.log('risk_subtype_suggest_error', {
      stage: this.stage,
      message: meta.message,
      code: meta.code,
      status: meta.status,
      durationMs: this.elapsedMs(),
    });
  }
}
