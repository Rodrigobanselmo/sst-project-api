import { Prisma } from '@prisma/client';

const RISK_MATRIX_LITERAL = `ARRAY[
  ARRAY[2,3,4,5,5,6],
  ARRAY[2,3,3,4,5,6],
  ARRAY[2,2,3,3,4,6],
  ARRAY[1,2,2,3,3,6],
  ARRAY[1,1,2,2,2,6]
]`;

/** Expressão SQL pura — reutilizada em ORDER BY (string raw). */
export const RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION = `
  CASE
    WHEN rfd."level" BETWEEN 1 AND 6 THEN rfd."level"
    WHEN rfd."probability" >= 6 AND risk."severity" BETWEEN 1 AND 6 THEN 6
    WHEN risk."severity" BETWEEN 1 AND 5 AND rfd."probability" BETWEEN 1 AND 5 THEN
      (${RISK_MATRIX_LITERAL})[6 - rfd."probability"][risk."severity"]
    ELSE NULL
  END
`.trim();

/** Fragmento Prisma.sql — reutilizado em WHERE, HAVING e SELECT. */
export const resolvedOccupationalRiskLevelSql = Prisma.sql([RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION]);

const RESOLVED_ACTION_PLAN_VALID_DATE_EXPRESSION = `
  CASE
    WHEN rfd_rec."endDate" IS NOT NULL THEN rfd_rec."endDate"
    WHEN dd."validityStart" IS NULL THEN NULL::timestamp
    WHEN (${RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION}) = 1 THEN dd."validityStart" + dd.months_period_level_2 * INTERVAL '1 month'
    WHEN (${RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION}) = 2 THEN dd."validityStart" + dd.months_period_level_2 * INTERVAL '1 month'
    WHEN (${RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION}) = 3 THEN dd."validityStart" + dd.months_period_level_3 * INTERVAL '1 month'
    WHEN (${RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION}) = 4 THEN dd."validityStart" + dd.months_period_level_4 * INTERVAL '1 month'
    WHEN (${RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION}) = 5 THEN dd."validityStart" + dd.months_period_level_5 * INTERVAL '1 month'
    WHEN (${RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION}) = 6 THEN dd."validityStart"
    ELSE NULL::timestamp
  END
`.trim();

export const resolvedActionPlanValidDateSql = Prisma.sql([RESOLVED_ACTION_PLAN_VALID_DATE_EXPRESSION]);

export const resolvedOccupationalRiskLevelOrderByExpression = `COALESCE((${RESOLVED_OCCUPATIONAL_RISK_LEVEL_EXPRESSION}), 0)`;
