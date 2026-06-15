import {
  HoMethodImportAgentSuggestion,
  HoMethodImportField,
  HoMethodImportParseResult,
} from './ho-method-import.types';
import { parseSamplingBlock } from './ho-method-niosh-sampling-parser.util';
import {
  associateExposureLimitsWithCompounds,
  buildAgentTechnicalNotesFromExposureRow,
  buildOccupationalLimitsFromExposureRow,
  createEmptyOccupationalLimits,
  formatCompoundName,
  isInvalidAgentCandidate,
  normalizeCompoundNameForMatch,
  parseNmamCompoundTable,
  parseNmamExposureLimitsTable,
  referencesNmamTable,
} from './ho-method-niosh-table-parser.util';

const field = <T>(
  value: T | null,
  confidence: HoMethodImportField<T>['confidence'],
  rawText?: string | null,
): HoMethodImportField<T> => ({
  value,
  confidence,
  rawText: rawText ?? null,
});

const firstMatch = (text: string, pattern: RegExp) => {
  const match = text.match(pattern);
  return match?.[1]?.trim() ?? null;
};

const parseCasNumbers = (text: string) => {
  const matches = [...text.matchAll(/\b(\d{2,7}-\d{2}-\d)\b/g)];
  return [...new Set(matches.map((match) => match[1]))];
};

const parseIssueDate = (text: string, issueNumber: string | null) => {
  if (!issueNumber) return null;
  const pattern = new RegExp(
    `Issue\\s*${issueNumber}\\s*:\\s*([\\d]{1,2}\\s+[A-Za-z]+\\s+[\\d]{4})`,
    'i',
  );
  return firstMatch(text, pattern);
};

const parseSamplerBlock = (text: string) => parseSamplingBlock(text)?.sampler ?? null;

const parseSynonyms = (text: string) => {
  const raw = firstMatch(text, /SYNONYMS:\s*([\s\S]*?)(?=SAMPLER:|ACCURACY|$)/i);
  if (!raw) return [] as string[];

  if (referencesNmamTable(raw.split('\n')[0], 1)) {
    return [] as string[];
  }

  return raw
    .split(/[;\n]/)
    .flatMap((part) => part.split(','))
    .map((item) => item.replace(/^[^:]*:\s*/, '').trim())
    .filter(Boolean);
};

const buildAgentSuggestion = (
  substanceName: string,
  cas: string | null,
  synonyms: string[],
  occupationalLimits?: HoMethodImportAgentSuggestion['occupationalLimits'],
  technicalNotes?: string[],
): HoMethodImportAgentSuggestion => ({
  substanceName: formatCompoundName(substanceName),
  cas,
  synonyms,
  occupationalLimits,
  technicalNotes,
  matchedRiskFactor: null,
  found: false,
  matchConfidence: 'none',
  candidateRiskFactors: [],
});

const parseAgentsFromCompoundTable = (text: string) => {
  const compoundRows = parseNmamCompoundTable(text);
  if (!compoundRows.length) return [] as HoMethodImportAgentSuggestion[];

  const exposureRows = parseNmamExposureLimitsTable(text);
  const limitsByCompound = associateExposureLimitsWithCompounds(
    compoundRows,
    exposureRows,
  );

  return compoundRows.map((row) => {
    const limits = limitsByCompound.get(
      normalizeCompoundNameForMatch(row.compound),
    );

    return buildAgentSuggestion(
      row.compound,
      row.cas,
      row.synonyms,
      limits ? buildOccupationalLimitsFromExposureRow(limits) : undefined,
      buildAgentTechnicalNotesFromExposureRow(limits),
    );
  });
};

const parseAgentsFromText = (
  text: string,
  synonyms: string[],
  methodCode: string | null,
) => {
  const casHeader = firstMatch(text, /CAS:\s*([^\n]+)/i);
  const analyteRaw = firstMatch(text, /ANALYTE:\s*([^\n]+)/i);
  const synonymsHeader = firstMatch(text, /SYNONYMS:\s*([^\n]+)/i);
  const oshaHeader = firstMatch(text, /OSHA:\s*([^\n]+)/i);
  const nioshHeader =
    firstMatch(text, /NIOSH(?:\s*REL)?:\s*([^\n]+)/i) ??
    firstMatch(text, /NIOSH:\s*([^\n]+)/i);

  const usesCompoundTable =
    referencesNmamTable(casHeader, 1) ||
    referencesNmamTable(analyteRaw, 1) ||
    referencesNmamTable(synonymsHeader, 1) ||
    /see\s+(?:individual\s+compounds\s+in\s+)?table\s+1/i.test(analyteRaw ?? '') ||
    /see\s+(?:individual\s+compounds\s+in\s+)?table\s+1/i.test(synonymsHeader ?? '');

  const usesLimitsTable =
    referencesNmamTable(oshaHeader, 2) ||
    referencesNmamTable(oshaHeader, 3) ||
    referencesNmamTable(nioshHeader, 2) ||
    referencesNmamTable(nioshHeader, 3);

  if (usesCompoundTable || usesLimitsTable) {
    const tableAgents = parseAgentsFromCompoundTable(text);
    if (tableAgents.length) return tableAgents;
  }

  const fallbackTableAgents = parseAgentsFromCompoundTable(text);
  if (fallbackTableAgents.length >= 2) return fallbackTableAgents;

  const titlePattern = methodCode
    ? new RegExp(
        `NIOSH Manual of Analytical Methods[\\s\\S]*?\\n([A-Z0-9][A-Z0-9 /-]{2,}?)\\s+${methodCode}`,
        'i',
      )
    : /NIOSH Manual of Analytical Methods[\s\S]*?\n([A-Z0-9][A-Z0-9 /-]{2,}?)\s+\d{3,5}/i;
  const titleMatch = text.match(titlePattern);
  const titleAgent =
    titleMatch?.[1]?.replace(/\s+/g, ' ').trim().toUpperCase() ?? null;

  const casNumbers = parseCasNumbers(text);

  const analyteNames =
    analyteRaw && !referencesNmamTable(analyteRaw, 1)
      ? analyteRaw
          .split(/\band\b|,|;/i)
          .map((name) => name.trim())
          .filter((name) => name && !isInvalidAgentCandidate(name))
      : [];

  const agents: HoMethodImportAgentSuggestion[] = [];

  if (analyteNames.length && casNumbers.length >= analyteNames.length) {
    analyteNames.forEach((name, index) => {
      agents.push(
        buildAgentSuggestion(name, casNumbers[index] ?? null, synonyms),
      );
    });
    return agents;
  }

  if (analyteNames.length) {
    analyteNames.forEach((name) => {
      agents.push(buildAgentSuggestion(name, null, synonyms));
    });
    return agents;
  }

  if (titleAgent && !isInvalidAgentCandidate(titleAgent)) {
    agents.push(
      buildAgentSuggestion(titleAgent, casNumbers[0] ?? null, synonyms),
    );
  }

  return agents;
};

const capitalizeAgentName = (value: string) => formatCompoundName(value);

const parseStability = (text: string, samplingBlock?: ReturnType<typeof parseSamplingBlock>) => {
  const parsed =
    samplingBlock?.stability ??
  parseSamplingBlock(text)?.stability;

  if (!parsed) {
    return {
      stabilityText: field<string>(null, 'low'),
      stabilityDays: field<number>(null, 'low'),
      storageTemperature: field<number>(null, 'low'),
      storageTemperatureUnit: field<string>(null, 'low'),
    };
  }

  return {
    stabilityText: field(parsed.text, parsed.days != null ? 'high' : 'medium', parsed.text),
    stabilityDays: field(
      parsed.days,
      parsed.days != null ? 'high' : 'medium',
      parsed.text,
    ),
    storageTemperature: field(
      parsed.temperature,
      parsed.temperature != null ? 'high' : 'low',
      parsed.text,
    ),
    storageTemperatureUnit: field(
      parsed.temperatureUnit,
      parsed.temperatureUnit ? 'high' : 'low',
      parsed.text,
    ),
  };
};

const parseOccupationalLimits = (text: string) => {
  const oshaRaw = firstMatch(text, /OSHA:\s*([^\n]+)/i);
  const nioshRaw =
    firstMatch(text, /NIOSH(?:\s*REL)?:\s*([^\n]+)/i) ??
    firstMatch(text, /NIOSH:\s*([^\n]+)/i);
  const acgihRaw = firstMatch(text, /ACGIH:\s*([^\n]+)/i);
  const aihaRaw =
    firstMatch(text, /AIHA(?:\s+WEEL)?:\s*([^\n]+)/i) ??
    firstMatch(text, /WEEL:\s*([^\n]+)/i);
  const idlhRaw =
    firstMatch(text, /IDLH:\s*([^\n]+)/i) ??
    firstMatch(text, /IDHL:\s*([^\n]+)/i) ??
    firstMatch(text, /IPVS:\s*([^\n]+)/i);

  if (
    referencesNmamTable(oshaRaw, 3) ||
    referencesNmamTable(nioshRaw, 3) ||
    referencesNmamTable(oshaRaw, 2) ||
    referencesNmamTable(nioshRaw, 2)
  ) {
    return createEmptyOccupationalLimits();
  }

  const splitOsha = splitLimitValues(oshaRaw, 'osha');
  const splitNiosh = splitLimitValues(nioshRaw, 'niosh');
  const splitAcgih = splitLimitValues(acgihRaw, 'acgih');
  const splitAiha = splitLimitValues(aihaRaw, 'aiha');

  return {
    acgihTwa: field(splitAcgih.twa, splitAcgih.twa ? 'high' : 'low', acgihRaw),
    acgihStel: field(
      splitAcgih.stel,
      splitAcgih.stel ? 'medium' : 'low',
      acgihRaw,
    ),
    acgihCeiling: field(
      splitAcgih.ceiling,
      splitAcgih.ceiling ? 'medium' : 'low',
      acgihRaw,
    ),
    aihaWeel: field(splitAiha.weel, splitAiha.weel ? 'high' : 'low', aihaRaw),
    aihaWeelCeiling: field(
      splitAiha.ceiling,
      splitAiha.ceiling ? 'medium' : 'low',
      aihaRaw,
    ),
    oshaPel: field(splitOsha.pel, splitOsha.pel ? 'high' : 'low', oshaRaw),
    oshaStel: field(splitOsha.stel, splitOsha.stel ? 'medium' : 'low', oshaRaw),
    oshaCeiling: field(
      splitOsha.ceiling,
      splitOsha.ceiling ? 'medium' : 'low',
      oshaRaw,
    ),
    nioshRel: field(splitNiosh.rel, splitNiosh.rel ? 'high' : 'low', nioshRaw),
    nioshStel: field(
      splitNiosh.stel,
      splitNiosh.stel ? 'medium' : 'low',
      nioshRaw,
    ),
    nioshCeiling: field(
      splitNiosh.ceiling,
      splitNiosh.ceiling ? 'medium' : 'low',
      nioshRaw,
    ),
    nioshIdlh: field(idlhRaw, idlhRaw ? 'medium' : 'low', idlhRaw),
  };
};

const splitLimitValues = (
  raw: string | null,
  source: 'osha' | 'niosh' | 'acgih' | 'aiha',
) => {
  if (!raw?.trim()) {
    return {
      pel: null,
      rel: null,
      twa: null,
      stel: null,
      ceiling: null,
      weel: null,
    };
  }

  const normalized = raw.trim();
  const stelMatch = normalized.match(/STEL[:\s]*([^;]+)/i);
  const ceilingMatch = normalized.match(/(?:Ceiling|CEILING|Ceil\.?|WEEL-C)[:\s]*([^;]+)/i);
  const twaMatch = normalized.match(/TWA[:\s]*([^;]+)/i);
  const weelMatch = normalized.match(/WEEL[:\s]*([^;]+)/i);
  const primaryLabel =
    source === 'osha' ? 'PEL' : source === 'niosh' ? 'REL' : source === 'acgih' ? 'TWA' : 'WEEL';
  const primaryMatch = normalized.match(
    new RegExp(`${primaryLabel}[:\\s]*([^;]+)`, 'i'),
  );

  const stripMarkers = (value: string) =>
    value
      .replace(/^(PEL|REL|TWA|STEL|Ceiling|CEILING|WEEL|WEEL-C)\s*:?\s*/i, '')
      .trim();

  const primary =
    primaryMatch?.[1]?.trim() ??
    (!stelMatch && !ceilingMatch && !twaMatch && !weelMatch ? normalized : null);

  return {
    pel: source === 'osha' ? stripMarkers(primary ?? '') || null : null,
    rel: source === 'niosh' ? stripMarkers(primary ?? '') || null : null,
    twa: source === 'acgih' ? (twaMatch ? stripMarkers(twaMatch[1]) : stripMarkers(primary ?? '') || null) : null,
    weel: source === 'aiha' ? (weelMatch ? stripMarkers(weelMatch[1]) : stripMarkers(primary ?? '') || null) : null,
    stel: stelMatch ? stripMarkers(stelMatch[1]) : null,
    ceiling: ceilingMatch ? stripMarkers(ceilingMatch[1]) : null,
  };
};

export function parseNioshNmamPdfText(text: string): HoMethodImportParseResult {
  const isNioshManual = /NIOSH Manual of Analytical Methods/i.test(text);
  const detectedFormat = isNioshManual
    ? 'NIOSH'
    : /\bNMAM\b/i.test(text)
      ? 'NMAM'
      : 'UNKNOWN';

  const samplingBlock = parseSamplingBlock(text);

  const methodHeader = firstMatch(text, /METHOD:\s*([^,\n]+)/i);
  const methodCode = firstMatch(text, /METHOD:\s*(\d+)/i);
  const issueNumber = firstMatch(text, /Issue\s*(\d+)/i);
  const methodVersion = issueNumber ? `Issue ${issueNumber}` : null;
  const issueDate = parseIssueDate(text, issueNumber);
  const evaluation = firstMatch(text, /EVALUATION:\s*([A-Z]+)/i);
  const techniqueBlock = firstMatch(
    text,
    /(?:MEASUREMENT\s*)?TECHNIQUE:\s*([^\n]+)/i,
  );
  const techniqueShort = firstMatch(
    text,
    /\n(HPLC\/UV|GC\/FID|GC\/MS[^\n]*)\nAPPLICABILITY/i,
  );
  const technique = techniqueShort ?? techniqueBlock;
  const analyticalMethod = techniqueShort ?? techniqueBlock;
  const sampler = parseSamplerBlock(text);
  const flow = samplingBlock?.flow;
  const volume = samplingBlock?.volume;
  const flowRaw = flow?.raw ?? firstMatch(text, /FLOW RATE:\s*([^\n]+)/i);
  const volMinRaw = volume?.rawMin ?? firstMatch(text, /VOL-MIN:\s*([^\n]+)/i);
  const volMaxRaw =
    volume?.rawMax ?? firstMatch(text, /(?:VOL-MAX|MAX):\s*([^\n]+)/im);
  const shipment =
    samplingBlock?.shipment ?? firstMatch(text, /SHIPMENT:\s*([^\n]+)/i);
  const desorption =
    samplingBlock?.extractionSolvent ?? firstMatch(text, /DESORPTION:\s*([^\n]+)/i);
  const analyte = firstMatch(text, /ANALYTE:\s*([^\n]+)/i);
  const detector = firstMatch(text, /DETECTOR:\s*([^\n]+)/i);
  const lod = firstMatch(text, /ESTIMATED LOD:\s*([^\n]+)/i);
  const range = firstMatch(text, /RANGE:\s*([^\n]+)/i);
  const applicability = firstMatch(text, /APPLICABILITY:\s*([^\n]+)/i);
  const interferences = firstMatch(text, /INTERFERENCES:\s*([^\n]+)/i);
  const otherMethods = firstMatch(text, /OTHER METHODS:\s*([^\n]+)/i);
  const synonyms = parseSynonyms(text);
  const stability = parseStability(text, samplingBlock);
  const occupationalLimits = parseOccupationalLimits(text);

  const substanceTitle =
    firstMatch(text, /([^\n:]+?)\s*:\s*METHOD\s*\d+/i) ??
    firstMatch(
      text,
      /NIOSH Manual of Analytical Methods[\s\S]*?\n([A-Z][A-Z0-9 /-]{2,})\s+\d{3,5}/i,
    );
  const displayName =
    methodCode && detectedFormat !== 'UNKNOWN'
      ? `${detectedFormat} ${methodCode}${substanceTitle ? ` — ${capitalizeAgentName(substanceTitle)}` : ''}`
      : substanceTitle
        ? capitalizeAgentName(substanceTitle)
        : null;

  const agents = parseAgentsFromText(text, synonyms, methodCode);
  const warnings: string[] = [];

  if (detectedFormat === 'UNKNOWN') {
    warnings.push(
      'Não foi possível identificar claramente um método NIOSH/NMAM neste PDF.',
    );
  }

  if (!methodCode) {
    warnings.push('Código do método não identificado automaticamente.');
  }

  if (!agents.length) {
    warnings.push('Nenhum agente/substância identificado no PDF.');
  }

  const isSupportedMethod = detectedFormat !== 'UNKNOWN' && Boolean(methodCode);

  return {
    detectedFormat,
    isSupportedMethod,
    warnings,
    possibleDuplicate: {
      exists: false,
      message: null,
      existingMethodId: null,
    },
    fields: {
      institution: field(
        detectedFormat === 'UNKNOWN' ? null : 'NIOSH',
        detectedFormat === 'UNKNOWN' ? 'low' : 'high',
        methodHeader,
      ),
      methodCode: field(methodCode, methodCode ? 'high' : 'low', methodHeader),
      methodVersion: field(
        methodVersion,
        methodVersion ? 'high' : 'medium',
        methodHeader,
      ),
      issueDate: field(issueDate, issueDate ? 'high' : 'medium', issueDate),
      evaluation: field(evaluation, evaluation ? 'high' : 'medium', evaluation),
      displayName: field(
        displayName,
        displayName ? 'high' : 'medium',
        substanceTitle,
      ),
      analyticalMethod: field(
        analyticalMethod,
        analyticalMethod ? 'high' : 'medium',
        techniqueBlock ?? techniqueShort,
      ),
      sampler: field(sampler, sampler ? 'high' : 'low', sampler),
      minimumFlowRate: field(
        flow?.minimum ?? null,
        flow ? 'high' : 'low',
        flowRaw,
      ),
      maximumFlowRate: field(
        flow?.maximum ?? null,
        flow ? 'high' : 'low',
        flowRaw,
      ),
      flowRateUnit: field(flow?.unit ?? null, flow ? 'high' : 'low', flowRaw),
      minimumVolume: field(
        volume?.minimum ?? null,
        volume?.minimum != null ? 'high' : 'low',
        volMinRaw,
      ),
      maximumVolume: field(
        volume?.maximum ?? null,
        volume?.maximum != null ? 'high' : 'low',
        volMaxRaw,
      ),
      volumeUnit: field(
        volume ? volume.unit : null,
        volume ? 'high' : 'low',
        [volMinRaw, volMaxRaw].filter(Boolean).join(' · ') || null,
      ),
      shipment: field(shipment, shipment ? 'medium' : 'low', shipment),
      stabilityDays: stability.stabilityDays,
      stabilityText: stability.stabilityText,
      storageTemperature: stability.storageTemperature,
      storageTemperatureUnit: stability.storageTemperatureUnit,
      extractionSolvent: field(
        desorption,
        desorption ? 'high' : 'low',
        desorption,
      ),
      technique: field(technique, technique ? 'high' : 'medium', technique),
      analyte: field(analyte, analyte ? 'high' : 'medium', analyte),
      detector: field(detector, detector ? 'medium' : 'low', detector),
      lod: field(lod, lod ? 'medium' : 'low', lod),
      range: field(range, range ? 'medium' : 'low', range),
      applicability: field(
        applicability,
        applicability ? 'medium' : 'low',
        applicability,
      ),
      interferences: field(
        interferences,
        interferences ? 'medium' : 'low',
        interferences,
      ),
      observations: field(
        otherMethods,
        otherMethods ? 'medium' : 'low',
        otherMethods,
      ),
    },
    occupationalLimits,
    agents,
    canConfirm: false,
    confirmBlockReason: null,
  };
}
