import { HeadingLevel, Paragraph, TextRun } from 'docx';

interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

interface ParsedElement {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  segments: TextSegment[];
}

function getHeadingLevel(type: ParsedElement['type']) {
  switch (type) {
    case 'h1':
      return HeadingLevel.HEADING_1;
    case 'h2':
      return HeadingLevel.HEADING_2;
    case 'h3':
      return HeadingLevel.HEADING_3;
    case 'h4':
      return HeadingLevel.HEADING_4;
    default:
      return undefined;
  }
}

function parseInlineContent(html: string): TextSegment[] {
  const segments: TextSegment[] = [];

  // Remove leading/trailing whitespace
  html = html.trim();

  if (!html) return segments;

  // Pattern to match <strong>, <em>, <br> tags and text between them
  const tagPattern = /<(strong|em|br)\s*\/?>([\s\S]*?)<\/\1>|<br\s*\/?>|([^<]+)/gi;

  let match: RegExpExecArray | null;
  let currentBold = false;
  let currentItalic = false;

  // Stack-based parsing for nested tags
  const parseWithStack = (content: string, inheritBold = false, inheritItalic = false): TextSegment[] => {
    const result: TextSegment[] = [];
    let remaining = content;

    while (remaining.length > 0) {
      // Check for opening tags
      const strongMatch = remaining.match(/^<strong>([\s\S]*?)<\/strong>/i);
      const emMatch = remaining.match(/^<em>([\s\S]*?)<\/em>/i);
      const brMatch = remaining.match(/^<br\s*\/?>/i);
      const textMatch = remaining.match(/^([^<]+)/);

      if (strongMatch) {
        const innerSegments = parseWithStack(strongMatch[1], true, inheritItalic);
        result.push(...innerSegments);
        remaining = remaining.slice(strongMatch[0].length);
      } else if (emMatch) {
        const innerSegments = parseWithStack(emMatch[1], inheritBold, true);
        result.push(...innerSegments);
        remaining = remaining.slice(emMatch[0].length);
      } else if (brMatch) {
        result.push({ text: '\n', bold: inheritBold || undefined, italic: inheritItalic || undefined });
        remaining = remaining.slice(brMatch[0].length);
      } else if (textMatch) {
        const text = textMatch[1];
        if (text.trim() || text.includes(' ')) {
          result.push({
            text,
            bold: inheritBold || undefined,
            italic: inheritItalic || undefined,
          });
        }
        remaining = remaining.slice(textMatch[0].length);
      } else {
        // Skip unknown tags
        const skipTag = remaining.match(/^<[^>]*>/);
        if (skipTag) {
          remaining = remaining.slice(skipTag[0].length);
        } else {
          // Move forward one character to avoid infinite loop
          remaining = remaining.slice(1);
        }
      }
    }

    return result;
  };

  return parseWithStack(html);
}

function parseHtmlElements(html: string): ParsedElement[] {
  const elements: ParsedElement[] = [];

  // Pattern to match block-level elements
  const blockPattern = /<(h1|h2|h3|h4|p)>([\s\S]*?)<\/\1>/gi;

  let match: RegExpExecArray | null;
  while ((match = blockPattern.exec(html)) !== null) {
    const type = match[1].toLowerCase() as ParsedElement['type'];
    const content = match[2];

    elements.push({
      type,
      segments: parseInlineContent(content),
    });
  }

  return elements;
}

export function htmlToDocx(html: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (!html || !html.trim()) {
    return paragraphs;
  }

  const elements = parseHtmlElements(html);

  for (const element of elements) {
    const headingLevel = getHeadingLevel(element.type);

    const children: TextRun[] = [];

    for (const segment of element.segments) {
      if (segment.text === '\n') {
        children.push(new TextRun({ break: 1 }));
      } else {
        children.push(
          new TextRun({
            text: segment.text,
            bold: segment.bold,
            italics: segment.italic,
          }),
        );
      }
    }

    paragraphs.push(
      new Paragraph({
        children,
        heading: headingLevel,
      }),
    );
  }

  return paragraphs;
}
