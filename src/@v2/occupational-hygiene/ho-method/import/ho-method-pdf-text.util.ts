import { PDFParse } from 'pdf-parse';

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return normalizePdfText(result.text ?? '');
  } finally {
    await parser.destroy();
  }
}

function normalizePdfText(text: string) {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u03bc/g, 'μ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
