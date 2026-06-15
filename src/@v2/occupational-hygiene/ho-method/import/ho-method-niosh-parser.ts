import {
  HoMethodImportAgentSuggestion,
  HoMethodImportField,
  HoMethodImportParseResult,
} from './ho-method-import.types';
import {
  associateExposureLimitsWithCompounds,
  buildOccupationalLimitsFromExposureRow,
  createEmptyOccupationalLimits,
  formatCompoundName,
  isInvalidAgentCandidate,
  normalizeCompoundNameForMatch,
  parseCompoundSynonymsTable,
  parseExposureLimitsTable,
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

const parseNumber = (raw: string | null) => {
  if (!raw) return null;
  const normalized = raw.replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
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

const parseSamplingTable = (text: string) => {
  const tableMatch = text.match(
    /SAMPLER:\s*\nFLOW RATE:\s*\nVOL-MIN:\s*\nMAX:\s*\nSHIPMENT:\s*\nSAMPLE\s*\nSTABILITY:\s*\nBLANKS:\s*\n([\s\S]*?)(?=ACCURACY)/i,
  );

  if (!tableMatch) return null;

  const lines = tableMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const flowIdx = lines.findIndex((line) => /L\s*\/?\s*min/i.test(line));
  if (flowIdx < 1) return null;

  const sampler = lines
    .slice(0, flowIdx)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const flowRaw = lines[flowIdx] ?? null;
  const volMinRaw = lines[flowIdx + 1] ?? null;
  const volMaxRaw = lines[flowIdx + 2] ?? null;
  const shipment = lines[flowIdx + 3] ?? null;
  const stabilityRaw = lines[flowIdx + 4] ?? null;
  const blanks = lines.slice(flowIdx + 5).join(' · ') || null;

  const flowMatch = flowRaw?.match(
    /(\d+(?:[.,]\d+)?)\s*(?:-|–|to)\s*(\d+(?:[.,]\d+)?)\s*L\s*\/?\s*min/i,
  );
  const volMinMatch = volMinRaw?.match(/(\d+(?:[.,]\d+)?)\s*L/i);
  const volMaxMatch = volMaxRaw?.match(/(\d+(?:[.,]\d+)?)\s*L/i);

  const weekMatch = stabilityRaw?.match(/(\d+)\s*week/i);
  const dayMatch = stabilityRaw?.match(/(\d+)\s*day/i);
  const tempMatch = stabilityRaw?.match(/@\s*(\d+(?:[.,]\d+)?)\s*°?\s*([CF])/i);
  const stabilityDays = weekMatch
    ? Number(weekMatch[1]) * 7
    : dayMatch
      ? Number(dayMatch[1])
      : null;

  return {
    sampler,
    flowRaw,
    flowMatch,
    volMinRaw,
    volMaxRaw,
    volMinMatch,
    volMaxMatch,
    shipment,
    stabilityRaw,
    blanks,
    stabilityDays,
    tempMatch,
  };
};

const parseSamplerBlock = (text: string) => {
  const table = parseSamplingTable(text);
  if (table?.sampler) return table.sampler;

  const block = firstMatch(
    text,
    /SAMPLER:\s*([^\n]+)/i,
  );
  return block?.replace(/\s+/g, ' ').trim() || null;
};

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
): HoMethodImportAgentSuggestion => ({
  substanceName: formatCompoundName(substanceName),
  cas,
  synonyms,
  occupationalLimits,
  matchedRiskFactor: null,
  found: false,
  matchConfidence: 'none',
  candidateRiskFactors: [],
});

const parseAgentsFromCompoundTable = (text: string) => {
  const compoundRows = parseCompoundSynonymsTable(text);
  if (!compoundRows.length) return [] as HoMethodImportAgentSuggestion[];

  const exposureRows = parseExposureLimitsTable(text);
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

  if (
    referencesNmamTable(casHeader, 1) ||
    referencesNmamTable(analyteRaw, 1) ||
    referencesNmamTable(firstMatch(text, /SYNONYMS:\s*([^\n]+)/i), 1)
  ) {
    const tableAgents = parseAgentsFromCompoundTable(text);
    if (tableAgents.length) return tableAgents;
  }

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

const parseStability = (text: string, table?: ReturnType<typeof parseSamplingTable>) => {
  const raw =
    table?.stabilityRaw ??
    firstMatch(text, /(?:SAMPLE\s*)?STABILITY:\s*([^\n]+)/i);

  if (!raw) {
    return {
      stabilityText: field<string>(null, 'low'),
      stabilityDays: field<number>(null, 'low'),
      storageTemperature: field<number>(null, 'low'),
      storageTemperatureUnit: field<string>(null, 'low'),
    };
  }

  const weekMatch = raw.match(/(\d+)\s*week/i);
  const dayMatch = raw.match(/(\d+)\s*day/i);
  const tempMatch =
    table?.tempMatch ?? raw.match(/@\s*(\d+(?:[.,]\d+)?)\s*°?\s*([CF])/i);

  const stabilityDays =
    table?.stabilityDays ??
    (weekMatch
      ? Number(weekMatch[1]) * 7
      : dayMatch
        ? Number(dayMatch[1])
        : null);

  return {
    stabilityText: field(raw, weekMatch || dayMatch ? 'high' : 'medium', raw),
    stabilityDays: field(
      stabilityDays,
      stabilityDays != null ? 'high' : 'medium',
      raw,
    ),
    storageTemperature: field(
      tempMatch ? parseNumber(tempMatch[1]) : null,
      tempMatch ? 'high' : 'low',
      raw,
    ),
    storageTemperatureUnit: field(
      tempMatch ? `°${tempMatch[2].toUpperCase()}` : null,
      tempMatch ? 'high' : 'low',
      raw,
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
    referencesNmamTable(nioshRaw, 3)
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

  const samplingTable = parseSamplingTable(text);

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
  const flowRaw =
    samplingTable?.flowRaw ?? firstMatch(text, /FLOW RATE:\s*([^\n]+)/i);
  const flowMatch =
    samplingTable?.flowMatch ??
    flowRaw?.match(
      /(\d+(?:[.,]\d+)?)\s*(?:-|–|to)\s*(\d+(?:[.,]\d+)?)\s*L\s*\/?\s*min/i,
    );
  const volMinRaw =
    samplingTable?.volMinRaw ?? firstMatch(text, /VOL-MIN:\s*([^\n]+)/i);
  const volMaxRaw =
    samplingTable?.volMaxRaw ??
    firstMatch(text, /(?:^|\n)MAX:\s*([^\n]+)/im);
  const volMinMatch =
    samplingTable?.volMinMatch ?? volMinRaw?.match(/(\d+(?:[.,]\d+)?)\s*L/i);
  const volMaxMatch =
    samplingTable?.volMaxMatch ?? volMaxRaw?.match(/(\d+(?:[.,]\d+)?)\s*L/i);
  const shipment =
    samplingTable?.shipment ?? firstMatch(text, /SHIPMENT:\s*([^\n]+)/i);
  const desorption = firstMatch(text, /DESORPTION:\s*([^\n]+)/i);
  const analyte = firstMatch(text, /ANALYTE:\s*([^\n]+)/i);
  const detector = firstMatch(text, /DETECTOR:\s*([^\n]+)/i);
  const lod = firstMatch(text, /ESTIMATED LOD:\s*([^\n]+)/i);
  const range = firstMatch(text, /RANGE:\s*([^\n]+)/i);
  const applicability = firstMatch(text, /APPLICABILITY:\s*([^\n]+)/i);
  const interferences = firstMatch(text, /INTERFERENCES:\s*([^\n]+)/i);
  const otherMethods = firstMatch(text, /OTHER METHODS:\s*([^\n]+)/i);
  const synonyms = parseSynonyms(text);
  const stability = parseStability(text, samplingTable);
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
        flowMatch ? parseNumber(flowMatch[1]) : null,
        flowMatch ? 'high' : 'low',
        flowRaw,
      ),
      maximumFlowRate: field(
        flowMatch ? parseNumber(flowMatch[2]) : null,
        flowMatch ? 'high' : 'low',
        flowRaw,
      ),
      flowRateUnit: field(flowMatch ? 'L/min' : null, flowMatch ? 'high' : 'low', flowRaw),
      minimumVolume: field(
        volMinMatch ? parseNumber(volMinMatch[1]) : null,
        volMinMatch ? 'high' : 'low',
        volMinRaw,
      ),
      maximumVolume: field(
        volMaxMatch ? parseNumber(volMaxMatch[1]) : null,
        volMaxMatch ? 'high' : 'low',
        volMaxRaw,
      ),
      volumeUnit: field(
        volMinMatch || volMaxMatch ? 'L' : null,
        volMinMatch || volMaxMatch ? 'high' : 'low',
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
