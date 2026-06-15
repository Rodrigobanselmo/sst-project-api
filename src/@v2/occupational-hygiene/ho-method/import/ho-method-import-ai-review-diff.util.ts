import { HoMethodImportParseResult } from './ho-method-import.types';
import { HoMethodAiReviewResult } from './ho-method-import-ai-review.types';

const INVALID_AGENT_NAMES = new Set([
  'table 1',
  'table 2',
  'table 3',
  'sampling',
  'analyte',
  'cas',
  'osha',
  'niosh',
  'method',
  'properties',
  'range',
  'lod',
]);

const normalizeAgentName = (value?: string | null) =>
  value?.trim().toLowerCase().replace(/\s+/g, ' ') ?? '';

export const isInvalidHoMethodAiAgentName = (name?: string | null) => {
  const normalized = normalizeAgentName(name);
  return !normalized || INVALID_AGENT_NAMES.has(normalized);
};

export const buildHoMethodParserAiComparison = (
  parserResult: HoMethodImportParseResult,
  aiResult: HoMethodAiReviewResult,
) => {
  const parserAgentCount = parserResult.agents.length;
  const aiAgentCount = aiResult.agents.length;
  const differences: string[] = [];

  if (aiAgentCount > parserAgentCount) {
    differences.push(
      `A IA identificou ${aiAgentCount} agente(s) e o parser determinístico ${parserAgentCount}.`,
    );
  } else if (aiAgentCount < parserAgentCount) {
    differences.push(
      `A IA identificou ${aiAgentCount} agente(s) e o parser determinístico ${parserAgentCount}.`,
    );
  }

  const parserCas = new Set(
    parserResult.agents.map((agent) => agent.cas?.trim()).filter(Boolean),
  );
  const aiCas = new Set(
    aiResult.agents.map((agent) => agent.cas?.trim()).filter(Boolean),
  );

  aiCas.forEach((cas) => {
    if (cas && !parserCas.has(cas)) {
      differences.push(`CAS ${cas} identificado pela IA e não pelo parser.`);
    }
  });

  parserCas.forEach((cas) => {
    if (cas && !aiCas.has(cas)) {
      differences.push(`CAS ${cas} identificado pelo parser e não pela IA.`);
    }
  });

  const parserSampler = parserResult.fields.sampler.value?.trim();
  const aiSampler =
    aiResult.sampling?.samplerPtBr?.trim() ||
    aiResult.sampling?.samplerOriginal?.trim();

  if (parserSampler && aiSampler && normalizeAgentName(parserSampler) !== normalizeAgentName(aiSampler)) {
    differences.push('Amostrador sugerido pela IA difere do parser.');
  }

  const parserSolvent = parserResult.fields.extractionSolvent.value?.trim();
  const aiSolvent =
    aiResult.preparation?.extractionSolventPtBr?.trim() ||
    aiResult.preparation?.extractionSolventOriginal?.trim();

  if (parserSolvent && aiSolvent && normalizeAgentName(parserSolvent) !== normalizeAgentName(aiSolvent)) {
    differences.push('Solvente sugerido pela IA difere do parser.');
  }

  return {
    parserAgentCount,
    aiAgentCount,
    differences,
  };
};

export const filterValidHoMethodAiAgents = (
  agents: HoMethodAiReviewResult['agents'],
) =>
  agents.filter((agent) => {
    if (isInvalidHoMethodAiAgentName(agent.name)) return false;
    return Boolean(agent.name?.trim() || agent.cas?.trim());
  });
