import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

import { AcgihRiskCorrelationItem } from './acgih-risk-correlation.service';
import { AcgihRiskCorrelationLink } from './acgih-risk-correlation.util';
import { AcgihRiskCorrelationApplyService } from './acgih-risk-correlation-apply.service';
import {
  ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS,
  AcgihRiskCorrelationApplyBody,
} from './acgih-risk-correlation-apply.dto';

const link = (
  over: Partial<AcgihRiskCorrelationLink> = {},
): AcgihRiskCorrelationLink => ({
  riskFactorId: 'risk-1',
  riskName: 'Fator X',
  riskCasRaw: '100-00-0',
  riskCasParsed: ['100000'],
  matchMethod: 'CAS_EXACT',
  confidence: 'HIGH',
  isGroup: false,
  ...over,
});

const item = (
  over: Partial<AcgihRiskCorrelationItem> = {},
): AcgihRiskCorrelationItem => ({
  acgihBeiIndicatorId: 'acgih-1',
  substanceName: 'Substância X',
  cas: '100-00-0',
  matrix: null,
  determinant: null,
  officialIndicatorId: 'official-1',
  promoted: true,
  alreadyLinked: false,
  autoStatus: 'MATCH_CAS_EXACT',
  finalStatus: 'MATCH_CAS_EXACT',
  decisionSource: 'AUTO',
  cardinality: 'SINGLE',
  links: [link()],
  blockers: [],
  warnings: [],
  note: '',
  ...over,
});

const tdiItem = (): AcgihRiskCorrelationItem =>
  item({
    acgihBeiIndicatorId: 'tdi',
    substanceName: 'TDI',
    officialIndicatorId: 'official-tdi',
    finalStatus: 'ACEITAR_MULTIPLO_CANONICO',
    decisionSource: 'MANUAL_OVERRIDE',
    cardinality: 'MULTIPLE',
    links: [
      link({ riskFactorId: 'tdi-24', riskName: '2,4 Diisocianato de tolueno' }),
      link({ riskFactorId: 'tdi-26', riskName: '2,6 Diisocianato de tolueno' }),
    ],
  });

type Ctx = {
  service: AcgihRiskCorrelationApplyService;
  preview: { preview: jest.Mock };
  findMany: jest.Mock;
  create: jest.Mock;
  transaction: jest.Mock;
};

const buildCtx = (items: AcgihRiskCorrelationItem[]): Ctx => {
  const create = jest.fn();
  const findMany = jest.fn().mockResolvedValue([] as never);
  const tx = { biologicalIndicatorToRisk: { create } };
  const transaction = jest.fn(async (cb: any) => cb(tx));
  const prisma = {
    biologicalIndicatorToRisk: { findMany },
    $transaction: transaction,
  } as any;
  const preview = {
    preview: jest.fn().mockResolvedValue({ summary: {}, items } as never),
  };
  const service = new AcgihRiskCorrelationApplyService(
    prisma,
    preview as any,
  );
  return { service, preview, findMany, create, transaction };
};

const p2002 = () =>
  new Prisma.PrismaClientKnownRequestError('dup', {
    code: 'P2002',
    clientVersion: '5.22.0',
  });

describe('AcgihRiskCorrelationApplyBody (confirmText)', () => {
  it('confirmText inválido reprova a validação (não chega no service)', async () => {
    const dto = plainToInstance(AcgihRiskCorrelationApplyBody, {
      confirmText: 'errado',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'confirmText')).toBe(true);
  });

  it('confirmText exato é aceito', async () => {
    const dto = plainToInstance(AcgihRiskCorrelationApplyBody, {
      confirmText: 'VINCULAR ACGIH RISCOS',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('AcgihRiskCorrelationApplyService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reexecuta o preview no servidor', async () => {
    const { service, preview } = buildCtx([]);
    await service.apply({ userId: 1 });
    expect(preview.preview).toHaveBeenCalledTimes(1);
  });

  it('item promovido SINGLE cria 1 vínculo (isPrimary/isConfirmed/requiresReview)', async () => {
    const { service, create } = buildCtx([item()]);
    create.mockResolvedValue({ id: 'link-1' } as never);

    const res = await service.apply({ acgihBeiIndicatorIds: ['acgih-1'], userId: 7 });

    expect(res.totals).toMatchObject({
      requestedItems: 1,
      eligibleItems: 1,
      createdLinks: 1,
      alreadyLinked: 0,
      skipped: 0,
      failed: 0,
    });
    expect(create).toHaveBeenCalledTimes(1);
    const data = (create.mock.calls[0][0] as { data: any }).data;
    expect(data).toMatchObject({
      indicatorId: 'official-1',
      riskFactorId: 'risk-1',
      riskNameSnapshot: 'Fator X',
      riskCasSnapshot: '100-00-0',
      matchConfidence: 'HIGH',
      matchMethod: 'CAS_EXACT',
      isPrimary: true,
      isConfirmed: true,
      requiresReview: false,
      confirmedById: 7,
    });
    expect(data.confirmedAt).toBeInstanceOf(Date);
    expect(data.notes).toContain('Frente A.3');
    expect(res.items[0].status).toBe('created');
    expect(res.items[0].links[0].isPrimary).toBe(true);
  });

  it('TDI MULTIPLE cria 2 vínculos na MESMA transação, isPrimary false nos dois', async () => {
    const { service, create, transaction } = buildCtx([tdiItem()]);
    create
      .mockResolvedValueOnce({ id: 'l-24' } as never)
      .mockResolvedValueOnce({ id: 'l-26' } as never);

    const res = await service.apply({ acgihBeiIndicatorIds: ['tdi'], userId: 9 });

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(2);
    expect(res.totals.createdLinks).toBe(2);
    expect(res.items[0].links).toHaveLength(2);
    expect(res.items[0].links.every((l) => l.isPrimary === false)).toBe(true);
    const first = (create.mock.calls[0][0] as { data: any }).data;
    expect(first.isPrimary).toBe(false);
    expect(first.matchConfidence).toBe('MANUAL');
    expect(first.matchMethod).toBe('MANUAL');
  });

  it('dryRun não grava nada e retorna formato simulado', async () => {
    const { service, create, transaction } = buildCtx([item()]);

    const res = await service.apply({
      acgihBeiIndicatorIds: ['acgih-1'],
      dryRun: true,
      userId: 1,
    });

    expect(create).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
    expect(res.dryRun).toBe(true);
    expect(res.totals.createdLinks).toBe(1);
    expect(res.items[0].status).toBe('created');
  });

  it('vínculo já existente vira alreadyLinked (sem create)', async () => {
    const { service, create, findMany } = buildCtx([item()]);
    findMany.mockResolvedValue([{ riskFactorId: 'risk-1' }] as never);

    const res = await service.apply({ acgihBeiIndicatorIds: ['acgih-1'], userId: 1 });

    expect(create).not.toHaveBeenCalled();
    expect(res.totals).toMatchObject({ createdLinks: 0, alreadyLinked: 1 });
    expect(res.items[0].status).toBe('alreadyLinked');
    expect(res.items[0].links[0].status).toBe('alreadyLinked');
  });

  it('P2002 na gravação vira alreadyLinked (corrida)', async () => {
    const { service, create } = buildCtx([item()]);
    create.mockRejectedValue(p2002() as never);

    const res = await service.apply({ acgihBeiIndicatorIds: ['acgih-1'], userId: 1 });

    expect(res.totals).toMatchObject({ createdLinks: 0, alreadyLinked: 1, failed: 0 });
    expect(res.items[0].status).toBe('alreadyLinked');
  });

  it('NOT_PROMOTED é pulado', async () => {
    const { service, create } = buildCtx([
      item({ officialIndicatorId: null, promoted: false }),
    ]);

    const res = await service.apply({ acgihBeiIndicatorIds: ['acgih-1'], userId: 1 });

    expect(create).not.toHaveBeenCalled();
    expect(res.totals.skipped).toBe(1);
    expect(res.items[0]).toMatchObject({ status: 'skipped', skipReason: 'NOT_PROMOTED' });
  });

  it('HAS_BLOCKERS é pulado', async () => {
    const { service, create } = buildCtx([
      item({ blockers: ['OVERRIDE_TARGET_MISSING'] }),
    ]);

    const res = await service.apply({ acgihBeiIndicatorIds: ['acgih-1'], userId: 1 });

    expect(create).not.toHaveBeenCalled();
    expect(res.items[0]).toMatchObject({ status: 'skipped', skipReason: 'HAS_BLOCKERS' });
  });

  it('falha real de um item NÃO aborta os demais', async () => {
    const a = item({ acgihBeiIndicatorId: 'a', officialIndicatorId: 'off-a' });
    const b = item({ acgihBeiIndicatorId: 'b', officialIndicatorId: 'off-b' });
    const { service, create } = buildCtx([a, b]);
    create
      .mockRejectedValueOnce(new Error('db down') as never)
      .mockResolvedValueOnce({ id: 'l-b' } as never);

    const res = await service.apply({
      acgihBeiIndicatorIds: ['a', 'b'],
      userId: 1,
    });

    expect(res.totals).toMatchObject({ failed: 1, createdLinks: 1 });
    const byId = new Map(res.items.map((i) => [i.acgihBeiIndicatorId, i]));
    expect(byId.get('a')!.status).toBe('failed');
    expect(byId.get('b')!.status).toBe('created');
  });

  it('aplica todos os elegíveis quando a lista é omitida (pula não-elegíveis)', async () => {
    const ok = item({ acgihBeiIndicatorId: 'ok', officialIndicatorId: 'off-ok' });
    const noMatch = item({
      acgihBeiIndicatorId: 'nm',
      finalStatus: 'NO_MATCH',
      links: [],
    });
    const { service, create } = buildCtx([ok, noMatch]);
    create.mockResolvedValue({ id: 'l' } as never);

    const res = await service.apply({ userId: 1 });

    expect(res.totals.requestedItems).toBe(1);
    expect(res.items[0].acgihBeiIndicatorId).toBe('ok');
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('IDs omitidos: lista elegível acima do teto => erro controlado e zero escrita', async () => {
    const many = Array.from({ length: ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS + 1 }, (_, i) =>
      item({ acgihBeiIndicatorId: `a-${i}`, officialIndicatorId: `off-${i}` }),
    );
    const { service, create, findMany, transaction } = buildCtx(many);

    await expect(service.apply({ userId: 1 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(create).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
  });

  it('IDs enviados acima do teto: DTO bloqueia na validação (ArrayMaxSize)', async () => {
    const ids = Array.from(
      { length: ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS + 1 },
      (_, i) => `id-${i}`,
    );
    const dto = plainToInstance(AcgihRiskCorrelationApplyBody, {
      confirmText: 'VINCULAR ACGIH RISCOS',
      acgihBeiIndicatorIds: ids,
    });
    const errors = await validate(dto);
    expect(
      errors.some((e) => e.property === 'acgihBeiIndicatorIds'),
    ).toBe(true);
  });

  it('dentro do teto: comportamento preservado (cria normalmente)', async () => {
    const within = Array.from({ length: ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS }, (_, i) =>
      item({ acgihBeiIndicatorId: `a-${i}`, officialIndicatorId: `off-${i}` }),
    );
    const { service, create } = buildCtx(within);
    create.mockResolvedValue({ id: 'l' } as never);

    const res = await service.apply({ userId: 1 });

    expect(res.totals.requestedItems).toBe(
      ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS,
    );
    expect(res.totals.createdLinks).toBe(
      ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS,
    );
    expect(create).toHaveBeenCalledTimes(
      ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS,
    );
  });

  it('só escreve em biologicalIndicatorToRisk.create (nenhum outro modelo)', async () => {
    const { service, create, transaction } = buildCtx([item()]);
    create.mockResolvedValue({ id: 'l' } as never);

    await service.apply({ acgihBeiIndicatorIds: ['acgih-1'], userId: 1 });

    // A transação só expõe biologicalIndicatorToRisk; qualquer outro acesso
    // de modelo lançaria. Garante o ponto único de escrita.
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
  });
});
