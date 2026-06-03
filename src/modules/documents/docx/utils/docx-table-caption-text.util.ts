/** Corrige grafias antigas em títulos de tabela (PARAGRAPH_TABLE), inclusive textos vindos do modelo salvo. */
export function normalizeDocxTableCaptionText(text: string): string {
  return text
    .replace(/\bnível hierarquico\b/gi, 'nível hierárquico')
    .replace(/\bNível Hierarquico\b/g, 'Nível Hierárquico');
}
