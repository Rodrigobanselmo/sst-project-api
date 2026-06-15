import * as fs from 'fs';
import * as path from 'path';

import { extractPdfText } from '../src/@v2/occupational-hygiene/ho-method/import/ho-method-pdf-text.util';
import { parseNioshNmamPdfText } from '../src/@v2/occupational-hygiene/ho-method/import/ho-method-niosh-parser';

async function main() {
  const pdfPath = path.join(__dirname, '..', 'pdf', '2514.pdf');
  const buffer = fs.readFileSync(pdfPath);
  const text = await extractPdfText(buffer);
  const result = parseNioshNmamPdfText(text);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
