import { describe, expect, it } from '@jest/globals';
import { BiologicalCollectionMomentEnum } from '@prisma/client';

import {
  AcgihPromotionMomentConfidence,
  mapCollectionMoment,
} from './acgih-official-indicator-preview.util';

describe('mapCollectionMoment (4P.2.1)', () => {
  it('mapeia código NR-7 exato (FJ) como SAFE', () => {
    const res = mapCollectionMoment('FJ');
    expect(res.mappedValue).toBe(BiologicalCollectionMomentEnum.FJ);
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.SAFE);
  });

  it('mapeia "Antes da última jornada da semana" para AJFS (SAFE)', () => {
    const res = mapCollectionMoment('Antes da última jornada da semana');
    expect(res.mappedValue).toBe(BiologicalCollectionMomentEnum.AJFS);
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.SAFE);
  });

  it('mapeia variação "Antes da última jornada semanal" para AJFS (SAFE)', () => {
    const res = mapCollectionMoment('Antes da última jornada semanal');
    expect(res.mappedValue).toBe(BiologicalCollectionMomentEnum.AJFS);
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.SAFE);
  });

  it('4P.2.2 — mapeia "Final da exposição" (n-Heptano) para FINAL_EXPOSURE (SAFE)', () => {
    const res = mapCollectionMoment('Final da exposição');
    expect(res.mappedValue).toBe(BiologicalCollectionMomentEnum.FINAL_EXPOSURE);
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.SAFE);
  });

  it('4P.2.2 — "Final da jornada" continua FJ (não confundir com Final da exposição)', () => {
    const res = mapCollectionMoment('Final da jornada');
    expect(res.mappedValue).toBe(BiologicalCollectionMomentEnum.FJ);
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.SAFE);
  });

  it('4P.2.2 — "Final da jornada e da semana" continua FJFS', () => {
    const res = mapCollectionMoment('Final da jornada e da semana');
    expect(res.mappedValue).toBe(BiologicalCollectionMomentEnum.FJFS);
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.SAFE);
  });

  it('"Não crítico" continua NC', () => {
    const res = mapCollectionMoment('Não crítico');
    expect(res.mappedValue).toBe(BiologicalCollectionMomentEnum.NC);
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.SAFE);
  });

  it('texto sem momento reconhecível fica UNMAPPED', () => {
    const res = mapCollectionMoment('qualquer texto sem momento');
    expect(res.mappedValue).toBeNull();
    expect(res.confidence).toBe(AcgihPromotionMomentConfidence.UNMAPPED);
  });

  it('vazio fica UNMAPPED', () => {
    expect(mapCollectionMoment('').confidence).toBe(
      AcgihPromotionMomentConfidence.UNMAPPED,
    );
    expect(mapCollectionMoment(null).confidence).toBe(
      AcgihPromotionMomentConfidence.UNMAPPED,
    );
  });
});
