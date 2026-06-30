import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { AcgihRiskCorrelationConsolidateService } from './acgih-risk-correlation-consolidate.service';
import {
  ACGIH_RISK_CORRELATION_EXPECTED_TOTAL,
  AcgihRiskCorrelationConsolidateBody,
} from './acgih-risk-correlation-consolidate.dto';

type CorrItem = {
  acgihBeiIndicatorId: string;
  substanceName: string;
  officialIndicatorId: string | null;
  finalStatus: string;
};

const promoted = (id: string): CorrItem => ({
  acgihBeiIndicatorId: id,
  substanceName: `Substância ${id}`,
  officialIndicatorId: `official-${id}`,
  finalStatus: 'MATCH_CAS_EXACT',
});

const notPromoted = (id: string, finalStatus = 'MATCH_CAS_EXACT'): CorrItem => ({
  acgihBeiIndicatorId: id,
  substanceName: `Substância ${id}`,
  officialIndicatorId: null,
  finalStatus,
});

/** Gera os 65: `promotedCount` já promovidos + o restante a promover. */
const make65 = (promotedCount: number): CorrItem[] => {
  const total = ACGIH_RISK_CORRELATION_EXPECTED_TOTAL;
  const arr: CorrItem[] = [];
  for (let i = 0; i < total; i++) {
    arr.push(i < promotedCount ? promoted(`p${i}`) : notPromoted(`n${i}`));
  }
  return arr;
};

type DraftResult = {
  status: 'created' | 'skipped' | 'blocked';
  occupationalBiologicalIndicatorId?: string;
  reason?: string;
};

const buildCtx = (
  items: CorrItem[],
  opts: {
    summary?: { total?: number; blockersCount?: number };
    draft?: (id: string) => DraftResult | Promise<DraftResult>;
  } = {},
) => {
  const summary = {
    total: opts.summary?.total ?? items.length,
    blockersCount: opts.summary?.blockersCount ?? 0,
  };
  const preview = jest.fn().mockResolvedValue({ summary, items } as never);

  const payloadMap = new Map(
    items
      .filter((i) => !i.officialIndicatorId)
      .map((i) => [
        i.acgihBeiIndicatorId,
        { acgihBeiIndicatorId: i.acgihBeiIndicatorId },
      ]),
  );
  const computePayloads = jest.fn().mockResolvedValue(payloadMap as never);

  const draftFn =
    opts.draft ??
    ((id: string): DraftResult => ({
      status: 'created',
      occupationalBiologicalIndicatorId: `new-${id}`,
    }));
  const createDraft = jest.fn(async (payload: any) =>
    draftFn(payload.acgihBeiIndicatorId),
  );

  const service = new AcgihRiskCorrelationConsolidateService(
    { preview } as any,
    { computeProposedPayloadsByAcgihId: computePayloads } as any,
    { createOfficialDraftFromPayload: createDraft } as any,
  );

  return { service, preview, computePayloads, createDraft };
};

describe('AcgihRiskCorrelationConsolidateBody (confirmText)', () => {
  it('confirmText inválido reprova a validação', async () => {
    const dto = plainToInstance(AcgihRiskCorrelationConsolidateBody, {
      confirmText: 'errado',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'confirmText')).toBe(true);
  });

  it('confirmText exato é aceito', async () => {
    const dto = plainToInstance(AcgihRiskCorrelationConsolidateBody, {
      confirmText: 'CONSOLIDAR ACGIH',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('AcgihRiskCorrelationConsolidateService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reexecuta o preview de correlação no servidor', async () => {
    const { service, preview } = buildCtx(make65(65));
    await service.consolidate({ userId: 1 });
    expect(preview).toHaveBeenCalledTimes(1);
  });

  it('todos já promovidos: alreadyPromoted=65, created=0, sem escrita', async () => {
    const { service, createDraft } = buildCtx(make65(65));

    const res = await service.consolidate({ userId: 1 });

    expect(res).toMatchObject({
      totalAcgih: 65,
      alreadyPromoted: 65,
      created: 0,
      skipped: 0,
      failed: 0,
    });
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('42 promovidos + 23 novos: created=23, alreadyPromoted=42, total=65', async () => {
    const { service, createDraft } = buildCtx(make65(42));

    const res = await service.consolidate({ userId: 7 });

    expect(res).toMatchObject({
      totalAcgih: 65,
      alreadyPromoted: 42,
      created: 23,
      skipped: 0,
      failed: 0,
    });
    expect(createDraft).toHaveBeenCalledTimes(23);
    expect(res.items).toHaveLength(65);
    expect(res.items.filter((i) => i.status === 'created')).toHaveLength(23);
  });

  it('idempotência/P2002: createOfficialDraft "skipped" vira alreadyPromoted', async () => {
    const { service, createDraft } = buildCtx(make65(42), {
      draft: () => ({ status: 'skipped', reason: 'já existe (P2002)' }),
    });

    const res = await service.consolidate({ userId: 1 });

    expect(createDraft).toHaveBeenCalledTimes(23);
    expect(res).toMatchObject({
      alreadyPromoted: 65,
      created: 0,
      failed: 0,
    });
  });

  it('bloqueia se blockersCount > 0 (zero escrita)', async () => {
    const { service, createDraft, computePayloads } = buildCtx(make65(42), {
      summary: { blockersCount: 3 },
    });

    await expect(service.consolidate({ userId: 1 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(computePayloads).not.toHaveBeenCalled();
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('bloqueia se total != 65 (zero escrita)', async () => {
    const items = make65(42).slice(0, 64);
    const { service, createDraft } = buildCtx(items);

    await expect(service.consolidate({ userId: 1 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('bloqueia se houver finalStatus NO_MATCH/AMBIGUOUS/OVERRIDE_TARGET_MISSING', async () => {
    const items = make65(42);
    items[64] = notPromoted('bad', 'NO_MATCH');
    const { service, createDraft } = buildCtx(items);

    await expect(service.consolidate({ userId: 1 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('createOfficialDraft "blocked" vira failed e NÃO aborta o lote', async () => {
    const { service, createDraft } = buildCtx(make65(42), {
      draft: (id) =>
        id === 'n42'
          ? { status: 'blocked', reason: 'momento não mapeável' }
          : { status: 'created', occupationalBiologicalIndicatorId: `new-${id}` },
    });

    const res = await service.consolidate({ userId: 1 });

    expect(createDraft).toHaveBeenCalledTimes(23);
    expect(res.failed).toBe(1);
    expect(res.created).toBe(22);
    const failed = res.items.find((i) => i.status === 'failed');
    expect(failed?.reason).toContain('momento');
  });

  it('exceção real ao criar um item vira failed e NÃO aborta os demais', async () => {
    const { service } = buildCtx(make65(42), {
      draft: (id) => {
        if (id === 'n42') throw new Error('db down');
        return { status: 'created', occupationalBiologicalIndicatorId: `new-${id}` };
      },
    });

    const res = await service.consolidate({ userId: 1 });

    expect(res.failed).toBe(1);
    expect(res.created).toBe(22);
    expect(res.items.find((i) => i.status === 'failed')?.reason).toContain(
      'db down',
    );
  });

  it('só usa createOfficialDraftFromPayload (nenhum outro ponto de escrita)', async () => {
    const { service, createDraft } = buildCtx(make65(64));

    const res = await service.consolidate({ userId: 1 });

    // createDraft é o ÚNICO mecanismo de escrita exposto ao service; ele cria
    // apenas OccupationalBiologicalIndicator (sem risk-link/exam-link/regra).
    expect(createDraft).toHaveBeenCalledTimes(1);
    expect(res.created).toBe(1);
    expect(res.items.find((i) => i.status === 'created')?.officialIndicatorId)
      .toBeTruthy();
  });
});
