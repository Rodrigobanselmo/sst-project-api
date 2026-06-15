export type ParsedFlowRate = {
  minimum: number;
  maximum: number;
  unit: string;
  raw: string;
};

export type ParsedVolume = {
  minimum: number | null;
  maximum: number | null;
  unit: string;
  rawMin: string | null;
  rawMax: string | null;
};

export type ParsedStability = {
  days: number | null;
  text: string;
  temperature: number | null;
  temperatureUnit: string | null;
};

export type ParsedSamplingBlock = {
  sampler: string | null;
  flow: ParsedFlowRate | null;
  volume: ParsedVolume | null;
  shipment: string | null;
  stability: ParsedStability | null;
  blanks: string | null;
  extractionSolvent: string | null;
};

const parseDecimal = (raw: string | null | undefined) => {
  if (!raw) return null;
  const normalized = raw.replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const isFlowRateLine = (line: string) => /L\s*\/?\s*min/i.test(line);

const isVolumeLine = (line: string) => /^\d+(?:[.,]\d+)?\s*L\b/i.test(line.trim());

export const parseFlowRateValue = (raw: string | null): ParsedFlowRate | null => {
  if (!raw) return null;

  const rangeMatch = raw.match(
    /(\d+(?:[.,]\d+)?)\s*(?:-|–|to)\s*(\d+(?:[.,]\d+)?)\s*L\s*\/?\s*min/i,
  );
  if (rangeMatch) {
    const minimum = parseDecimal(rangeMatch[1]);
    const maximum = parseDecimal(rangeMatch[2]);
    if (minimum == null || maximum == null) return null;

    return {
      minimum,
      maximum,
      unit: 'L/min',
      raw,
    };
  }

  const fixedMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*L\s*\/?\s*min/i);
  if (!fixedMatch) return null;

  const value = parseDecimal(fixedMatch[1]);
  if (value == null) return null;

  return {
    minimum: value,
    maximum: value,
    unit: 'L/min',
    raw,
  };
};

export const parseVolumeValues = (
  volMinRaw: string | null,
  volMaxRaw: string | null,
): ParsedVolume | null => {
  const minMatch = volMinRaw?.match(/(\d+(?:[.,]\d+)?)\s*L/i);
  const maxMatch = volMaxRaw?.match(/(\d+(?:[.,]\d+)?)\s*L/i);
  const minimum = minMatch ? parseDecimal(minMatch[1]) : null;
  const maximum = maxMatch ? parseDecimal(maxMatch[1]) : null;

  if (minimum == null && maximum == null) return null;

  const fixedValue = minimum ?? maximum;

  return {
    minimum: minimum ?? fixedValue,
    maximum: maximum ?? fixedValue,
    unit: 'L',
    rawMin: volMinRaw,
    rawMax: volMaxRaw,
  };
};

export const parseStabilityValue = (raw: string | null): ParsedStability | null => {
  if (!raw?.trim()) return null;

  const weekMatch = raw.match(/(?:at least\s+)?(\d+)\s*weeks?/i);
  const dayMatch = raw.match(/(?:at least\s+)?(\d+)\s*days?/i);
  const days = weekMatch
    ? Number(weekMatch[1]) * 7
    : dayMatch
      ? Number(dayMatch[1])
      : null;

  const tempMatch =
    raw.match(
      /(?:@|at)\s*(?:<|≤|below|less than)?\s*(\d+(?:[.,]\d+)?)\s*°?\s*([CF])/i,
    ) ?? raw.match(/(?:<|≤)\s*(\d+(?:[.,]\d+)?)\s*°?\s*([CF])/i);

  return {
    days,
    text: raw.trim(),
    temperature: tempMatch ? parseDecimal(tempMatch[1]) : null,
    temperatureUnit: tempMatch ? `°${tempMatch[2].toUpperCase()}` : null,
  };
};

const captureBalancedSampler = (text: string) => {
  const start = text.search(/SAMPLER:\s*/i);
  if (start < 0) return null;

  const afterLabel = text.slice(start).replace(/^SAMPLER:\s*/i, '');
  const endPattern = /\n(?:FLOW RATE:|VOL-MIN:|ACCURACY|PRECISION|RANGE\b)/i;
  const block = afterLabel.split(endPattern)[0] ?? '';
  return normalizeWhitespace(block);
};

const joinSamplerLines = (lines: string[]) => normalizeWhitespace(lines.join(' '));

export const translateSamplerDescriptionToPtBr = (value: string) => {
  if (!value.trim()) return value;

  return normalizeWhitespace(
    value
      .replace(/\bFilter\s*\+\s*Sorbent tube\b/gi, 'Filtro + tubo adsorvente')
      .replace(/\bglass fiber filter\b/gi, 'filtro de fibra de vidro')
      .replace(/\bSorbent tube\b/gi, 'tubo adsorvente')
      .replace(/\bFilter\b/gi, 'Filtro')
      .replace(/\btube\b/gi, 'tubo')
      .replace(/(\d+)\s*-\s*mm/gi, '$1 mm'),
  );
};

const SOLVENT_STOP_PATTERN =
  /\b(?:ACCURACY|PRECISION|RANGE|APPLICABILITY|INTERFERENCES|OTHER METHODS|TECHNIQUE|DETECTOR)\b/i;

export const parseExtractionSolvent = (text: string): string | null => {
  const patterns = [
    /DESORPTION(?:\s*SOLVENT)?:\s*([^\n]+)/i,
    /EXTRACTION(?:\s*SOLVENT)?:\s*([^\n]+)/i,
    /SAMPLE\s*PREPARATION:\s*([\s\S]*?)(?=\n[A-Z][A-Z /-]{2,}:|\nACCURACY|\nPRECISION|$)/i,
    /PREPARATION:\s*([^\n]+)/i,
    /ELUENT:\s*([^\n]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    const raw = match?.[1]?.trim();
    if (!raw) continue;

    const firstLine = raw.split('\n')[0]?.trim() ?? '';
    if (!firstLine || SOLVENT_STOP_PATTERN.test(firstLine)) continue;

    const solventCandidate = normalizeWhitespace(
      firstLine
        .replace(/^(?:desorb(?:ed|ing)?|extract(?:ed|ing)?)\s+(?:with|in|using)\s+/i, '')
        .replace(/\.$/, ''),
    );

    if (!solventCandidate) continue;
    if (/benzene soluble fraction|cyclohexane soluble fraction/i.test(solventCandidate)) {
      continue;
    }

    return solventCandidate;
  }

  return null;
};

export const parseSamplingBlock = (text: string): ParsedSamplingBlock | null => {
  const tableMatch = text.match(
    /SAMPLER:\s*\nFLOW RATE:\s*\nVOL-MIN:\s*\nMAX:\s*\nSHIPMENT:\s*\n(?:SAMPLE\s*\n)?STABILITY:\s*\nBLANKS:\s*\n([\s\S]*?)(?=ACCURACY|PRECISION|RANGE\b|APPLICABILITY)/i,
  );

  if (tableMatch) {
    const lines = tableMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const flowIdx = lines.findIndex(isFlowRateLine);
    if (flowIdx >= 0) {
      const sampler = joinSamplerLines(lines.slice(0, flowIdx));
      const flowRaw = lines[flowIdx] ?? null;
      const volumeLines = lines.slice(flowIdx + 1).filter(isVolumeLine);
      const volMinRaw = volumeLines[0] ?? null;
      const volMaxRaw = volumeLines[1] ?? null;
      const afterVolumeIdx = flowIdx + 1 + volumeLines.length;
      const shipment = lines[afterVolumeIdx] ?? null;
      const stabilityRaw = lines[afterVolumeIdx + 1] ?? null;
      const blanks = lines.slice(afterVolumeIdx + 2).join(' · ') || null;

      return {
        sampler: sampler ? translateSamplerDescriptionToPtBr(sampler) : null,
        flow: parseFlowRateValue(flowRaw),
        volume: parseVolumeValues(volMinRaw, volMaxRaw),
        shipment,
        stability: parseStabilityValue(stabilityRaw),
        blanks,
        extractionSolvent: parseExtractionSolvent(text),
      };
    }
  }

  const sampler =
    captureBalancedSampler(text) ??
    text.match(/SAMPLER:\s*([^\n]+)/i)?.[1]?.trim() ??
    null;
  const flowRaw = text.match(/FLOW RATE:\s*([^\n]+)/i)?.[1]?.trim() ?? null;
  const volMinRaw = text.match(/VOL-MIN:\s*([^\n]+)/i)?.[1]?.trim() ?? null;
  const volMaxRaw =
    text.match(/(?:VOL-MAX|MAX):\s*([^\n]+)/i)?.[1]?.trim() ?? null;
  const shipment = text.match(/SHIPMENT:\s*([^\n]+)/i)?.[1]?.trim() ?? null;
  const stabilityRaw =
    text.match(/(?:SAMPLE\s*)?STABILITY:\s*([^\n]+)/i)?.[1]?.trim() ?? null;

  if (
    !sampler &&
    !flowRaw &&
    !volMinRaw &&
    !volMaxRaw &&
    !stabilityRaw &&
    !parseExtractionSolvent(text)
  ) {
    return null;
  }

  return {
    sampler: sampler ? translateSamplerDescriptionToPtBr(sampler) : null,
    flow: parseFlowRateValue(flowRaw),
    volume: parseVolumeValues(volMinRaw, volMaxRaw),
    shipment,
    stability: parseStabilityValue(stabilityRaw),
    blanks: null,
    extractionSolvent: parseExtractionSolvent(text),
  };
};
