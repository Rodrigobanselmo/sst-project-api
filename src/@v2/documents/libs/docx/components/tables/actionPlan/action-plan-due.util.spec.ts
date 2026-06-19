import { describe, expect, it } from '@jest/globals';

import { DocumentBaseDataVO } from '@/@v2/documents/domain/values-object/document-base-data.vo';
import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

import {
  formatActionPlanDueText,
  resolveActionPlanDueDate,
} from './action-plan-due.util';

const validityStart = new Date('2025-12-01T00:00:00.000Z');

const buildDocumentVersion = (validityStartValue: Date | null = validityStart) =>
  ({
    documentBase: {
      validityStart: validityStartValue,
      data: new DocumentBaseDataVO({
        monthsPeriodLevel_2: 24,
        monthsPeriodLevel_3: 12,
        monthsPeriodLevel_4: 6,
        monthsPeriodLevel_5: 3,
      }),
    },
  }) as DocumentVersionModel;

describe('action plan due util', () => {
  it('uses matrix level when stored level is invalid and calculates due date for level 1', () => {
    const { dueDate, resolvedLevel } = resolveActionPlanDueDate({
      severity: 1,
      probability: 1,
      storedLevel: null,
      endDate: null,
      documentVersion: buildDocumentVersion(),
    });

    expect(resolvedLevel).toBe(1);
    expect(dueDate?.getTime()).toBe(
      dateUtils(validityStart).addMonths(24).getTime(),
    );
    expect(formatActionPlanDueText(dueDate, resolvedLevel)).not.toBe('sem prazo');
  });

  it('manual endDate takes priority', () => {
    const endDate = new Date('2026-03-15T00:00:00.000Z');

    const { dueDate } = resolveActionPlanDueDate({
      severity: 3,
      probability: 3,
      storedLevel: 3,
      endDate,
      documentVersion: buildDocumentVersion(),
    });

    expect(dueDate?.getTime()).toBe(endDate.getTime());
    expect(formatActionPlanDueText(dueDate, 3)).toMatch(/\d{2}\/\d{2}\/\d{2}/);
  });

  it('returns sem prazo when validityStart is missing and there is no manual endDate', () => {
    const { dueDate, resolvedLevel } = resolveActionPlanDueDate({
      severity: 3,
      probability: 3,
      storedLevel: 3,
      endDate: null,
      documentVersion: buildDocumentVersion(null),
    });

    expect(dueDate).toBeNull();
    expect(formatActionPlanDueText(dueDate, resolvedLevel)).toBe('sem prazo');
  });

  it('formats level 6 without validityStart as acao imediata', () => {
    const { dueDate, resolvedLevel } = resolveActionPlanDueDate({
      severity: 5,
      probability: 5,
      storedLevel: 6,
      endDate: null,
      documentVersion: buildDocumentVersion(null),
    });

    expect(resolvedLevel).toBe(6);
    expect(formatActionPlanDueText(dueDate, resolvedLevel)).toBe('ação imediata');
  });
});
