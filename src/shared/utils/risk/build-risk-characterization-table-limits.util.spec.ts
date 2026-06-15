import { describe, expect, it } from '@jest/globals';

import { buildRiskCharacterizationTableLimitsDisplay } from './build-risk-characterization-table-limits.util';

describe('buildRiskCharacterizationTableLimitsDisplay', () => {
  it('Cenário A: ACGIH TWA tem prioridade sobre OSHA PEL', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      twa: '1 mg/m³',
      oshaPel: '0,5 mg/m³',
    });

    expect(result.acgihTwaColumn).toBe('1 mg/m³');
  });

  it('Cenário B: sem ACGIH TWA, exibe o menor entre OSHA PEL e NIOSH REL', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      oshaPel: '1 mg/m³',
      nioshRel: '0,5 mg/m³',
    });

    expect(result.acgihTwaColumn).toBe('0,5 mg/m³ NIOSH REL');
  });

  it('Cenário C: ACGIH Ceiling dedicado aparece na coluna STEL como teto', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      acgihCeiling: '5',
    });

    expect(result.acgihStelColumn).toBe('C 5');
  });

  it('Cenário D: menor STEL entre OSHA e NIOSH com identificação da fonte', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      oshaStel: '10 ppm',
      nioshStel: '5 ppm',
    });

    expect(result.acgihStelColumn).toBe('5 ppm NIOSH STEL');
  });

  it('Cenário E: AIHA WEEL-C identificado na coluna STEL', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      aihaWeelCeiling: '5 mg/m³',
    });

    expect(result.acgihStelColumn).toBe('C 5 mg/m³ AIHA WEEL-C');
  });

  it('Cenário F: teto legado em stel com marcador C', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      stel: 'C 5',
    });

    expect(result.acgihStelColumn).toBe('C 5');
  });

  it('Cenário G: acgihCeiling dedicado priorizado sem duplicar legado', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      acgihCeiling: '5',
      stel: 'C 5',
    });

    expect(result.acgihStelColumn).toBe('C 5');
    expect(result.acgihStelColumn).not.toContain('C 5 C');
  });

  it('NR-15 LT não mistura outras fontes', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      nr15lt: '10 mg/m³',
      oshaPel: '0,5 mg/m³',
    });

    expect(result.nr15LtColumn).toBe('10 mg/m³');
    expect(result.acgihTwaColumn).toBe('0,5 mg/m³ OSHA PEL');
  });

  it('IPVS continua alimentado por ipvs', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      ipvs: '100 ppm',
    });

    expect(result.ipvsColumn).toBe('100 ppm');
  });

  it('ACGIH TWA = "-" ignora placeholder e aplica fallback OSHA/NIOSH/AIHA', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      twa: '-',
      oshaPel: '1 mg/m³',
      nioshRel: '0,5 mg/m³',
    });

    expect(result.acgihTwaColumn).toBe('0,5 mg/m³ NIOSH REL');
  });

  it('ACGIH STEL = "-" sem ceiling válido aplica fallback alternativo', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      stel: '-',
      acgihCeiling: '-',
      oshaStel: '10 ppm',
      nioshStel: '5 ppm',
    });

    expect(result.acgihStelColumn).toBe('5 ppm NIOSH STEL');
  });

  it('NR-15 LT = "-" exibe como sem valor na tabela', () => {
    const result = buildRiskCharacterizationTableLimitsDisplay({
      nr15lt: '-',
    });

    expect(result.nr15LtColumn).toBe('--');
  });
});
