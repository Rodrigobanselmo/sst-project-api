/** Espaçamento padrão histórico (~1,46) em twips do Word. */
export const DOCX_LINE_SPACING_DEFAULT = 350;

/** Base do Word: 240 twips ≈ espaçamento simples (1,0) para fonte 12pt. */
const DOCX_LINE_SPACING_BASE = 240;

export const resolveLineHeightMultiplier = (
  lineHeight?: number,
  lineHeightBlock?: number[],
): number | undefined => {
  if (lineHeightBlock?.length) {
    const fromBlock = lineHeightBlock.find(
      (value) => value != null && !Number.isNaN(Number(value)),
    );
    if (fromBlock != null) return Number(fromBlock);
  }

  if (lineHeight != null && !Number.isNaN(Number(lineHeight))) {
    return Number(lineHeight);
  }

  return undefined;
};

export const lineHeightToDocxLineSpacing = (
  lineHeight?: number,
  lineHeightBlock?: number[],
): number => {
  const multiplier = resolveLineHeightMultiplier(lineHeight, lineHeightBlock);

  if (multiplier == null) return DOCX_LINE_SPACING_DEFAULT;

  return Math.round(DOCX_LINE_SPACING_BASE * multiplier);
};
