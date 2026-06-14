import {
  HoMethodImportAgentSuggestion,
  HoMethodImportField,
  HoMethodImportParseResult,
} from './ho-method-import.types';

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

  return raw
    .split(/[;\n]/)
    .flatMap((part) => part.split(','))
    .map((item) => item.replace(/^[^:]*:\s*/, '').trim())
    .filter(Boolean);
};

const parseAgentsFromText = (
  text: string,
  synonyms: string[],
  methodCode: string | null,
) => {
  const titlePattern = methodCode
    ? new RegExp(
        `NIOSH Manual of Analytical Methods[\\s\\S]*?\\n([A-Z0-9][A-Z0-9 /-]{2,}?)\\s+${methodCode}`,
        'i',
      )
    : /NIOSH Manual of Analytical Methods[\s\S]*?\n([A-Z0-9][A-Z0-9 /-]{2,}?)\s+\d{3,5}/i;
  const titleMatch = text.match(titlePattern);
  const titleAgent =
    titleMatch?.[1]?.replace(/\s+/g, ' ').trim().toUpperCase() ?? null;

  const analyteRaw = firstMatch(text, /ANALYTE:\s*([^\n]+)/i);
  const casNumbers = parseCasNumbers(text);

  const analyteNames =
    analyteRaw
      ?.split(/\band\b|,|;/i)
      .map((name) => name.trim())
      .filter(Boolean) ?? [];

  const agents: HoMethodImportAgentSuggestion[] = [];

  if (analyteNames.length && casNumbers.length >= analyteNames.length) {
    analyteNames.forEach((name, index) => {
      agents.push({
        substanceName: capitalizeAgentName(name),
        cas: casNumbers[index] ?? null,
        synonyms,
        matchedRiskFactor: null,
        found: false,
      });
    });
    return agents;
  }

  if (analyteNames.length) {
    analyteNames.forEach((name) => {
      agents.push({
        substanceName: capitalizeAgentName(name),
        cas: null,
        synonyms,
        matchedRiskFactor: null,
        found: false,
      });
    });
    return agents;
  }

  if (titleAgent) {
    agents.push({
      substanceName: capitalizeAgentName(titleAgent),
      cas: casNumbers[0] ?? null,
      synonyms,
      matchedRiskFactor: null,
      found: false,
    });
  }

  return agents;
};

const capitalizeAgentName = (value: string) =>
  value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

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

  const substanceTitle = firstMatch(
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
    agents,
    canConfirm: false,
    confirmBlockReason: null,
  };
}
