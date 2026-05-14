function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function applyInlineFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

export function formatBannerText(raw: string): string {
  const escaped = escapeHtml(raw);
  const lines = escaped.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*- (.+)/);

    if (bulletMatch) {
      if (!inList) {
        result.push('<ul style="margin:4px 0 4px 18px;padding:0;list-style:disc;">');
        inList = true;
      }
      result.push(`<li style="margin-bottom:2px;">${applyInlineFormatting(bulletMatch[1])}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      if (line.trim() === '') {
        result.push('<br/>');
      } else {
        result.push(applyInlineFormatting(line));
      }
    }
  }

  if (inList) result.push('</ul>');

  return result.join('\n');
}
