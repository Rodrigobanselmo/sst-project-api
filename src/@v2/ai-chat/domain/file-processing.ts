import { HumanMessage, AIMessage, type BaseMessage } from '@langchain/core/messages';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { config } from '@/@v2/shared/constants/config';
import type { AiFileAttachment } from '../database/repositories/ai-thread.repository';

// Lazy PrismaClient singleton for persistence operations
let _prisma: PrismaClient | null = null;
function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

/**
 * Attachment info for file processing (S3 coordinates + metadata)
 */
export interface FileAttachment {
  key: string;
  bucket: string;
  region: string;
  mimeType: string;
  filename: string;
  fileId?: string;
}

/**
 * Result of extracting content from a file
 */
export interface ExtractionResult {
  content: string | null;
  extractionType: string;
}

/**
 * History message with optional cached extracted content
 */
export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: AiFileAttachment[];
}

// ─── MIME type checks ───────────────────────────────────────────────

export function isExcelMimeType(mimeType: string): boolean {
  return (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

export function isDocxMimeType(mimeType: string): boolean {
  return (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
}

export function isTextMimeType(mimeType: string): boolean {
  return mimeType === 'text/plain';
}

export function isCsvMimeType(mimeType: string): boolean {
  return mimeType === 'text/csv' || mimeType === 'application/csv';
}

/** Returns true if this file type can be extracted to text */
function isTextExtractable(mimeType: string): boolean {
  return (
    isExcelMimeType(mimeType) ||
    isDocxMimeType(mimeType) ||
    isTextMimeType(mimeType) ||
    isCsvMimeType(mimeType) ||
    mimeType === 'application/pdf'
  );
}

// ─── S3 file fetching ───────────────────────────────────────────────

export async function fetchFileBuffer(attachment: FileAttachment): Promise<Buffer> {
  const s3 = new S3Client({ region: attachment.region });
  const command = new GetObjectCommand({ Bucket: attachment.bucket, Key: attachment.key });
  const response = await s3.send(command);
  if (!response.Body) throw new Error(`Failed to fetch file: ${attachment.key}`);
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

export async function fetchFileAsBase64DataUrl(attachment: FileAttachment): Promise<string> {
  const buffer = await fetchFileBuffer(attachment);
  const base64 = buffer.toString('base64');
  return `data:${attachment.mimeType};base64,${base64}`;
}

// ─── File parsers ───────────────────────────────────────────────────

export function parseExcelToCSV(buffer: Buffer, filename: string): string {
  try {
    const XLSX = require('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results: string[] = [];

    const sheetsToProcess = workbook.SheetNames.slice(0, 3);

    for (const sheetName of sheetsToProcess) {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) continue;

      const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });

      const lines = csv.split('\n');
      const limitedLines = lines.slice(0, 100);
      const truncated = lines.length > 100;

      const sheetContent = limitedLines.join('\n');
      if (sheetContent.trim()) {
        results.push(
          `--- Sheet: ${sheetName} ---\n${sheetContent}${truncated ? `\n... (${lines.length - 100} more rows truncated)` : ''}`,
        );
      }
    }

    if (workbook.SheetNames.length > 3) {
      results.push(`\n... (${workbook.SheetNames.length - 3} more sheets not shown)`);
    }

    return `[Excel File: ${filename}]\n${results.join('\n\n')}`;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return `[Excel File: ${filename}]\nError: Could not parse Excel file. The file may be corrupted or in an unsupported format.`;
  }
}

export async function parseDocxToText(buffer: Buffer, filename: string): Promise<string> {
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value.trim();

  const maxChars = 50000;
  if (text.length > maxChars) {
    return `[Word Document: ${filename}]\n${text.slice(0, maxChars)}\n... (${text.length - maxChars} more characters truncated)`;
  }

  return `[Word Document: ${filename}]\n${text}`;
}

export function parseTextFile(buffer: Buffer, filename: string): string {
  const text = buffer.toString('utf-8').trim();

  const maxChars = 50000;
  if (text.length > maxChars) {
    return `[Text File: ${filename}]\n${text.slice(0, maxChars)}\n... (${text.length - maxChars} more characters truncated)`;
  }

  return `[Text File: ${filename}]\n${text}`;
}

function parseCsvFile(buffer: Buffer, filename: string): string {
  const text = buffer.toString('utf-8').trim();

  const lines = text.split('\n');
  const limitedLines = lines.slice(0, 200);
  const truncated = lines.length > 200;

  const content = limitedLines.join('\n');
  return `[CSV File: ${filename}]\n${content}${truncated ? `\n... (${lines.length - 200} more rows truncated)` : ''}`;
}

// ─── Core extraction logic ──────────────────────────────────────────

/**
 * Extract content from a file attachment by downloading from S3 and parsing.
 * Returns the extracted text and the extraction type.
 */
export async function extractFileContent(attachment: FileAttachment): Promise<ExtractionResult> {
  const { mimeType, filename } = attachment;

  if (isExcelMimeType(mimeType)) {
    const buffer = await fetchFileBuffer(attachment);
    return {
      content: parseExcelToCSV(buffer, filename),
      extractionType: 'csv',
    };
  }

  if (isDocxMimeType(mimeType)) {
    const buffer = await fetchFileBuffer(attachment);
    const text = await parseDocxToText(buffer, filename);
    return { content: text, extractionType: 'docx' };
  }

  if (isTextMimeType(mimeType)) {
    const buffer = await fetchFileBuffer(attachment);
    return {
      content: parseTextFile(buffer, filename),
      extractionType: 'text',
    };
  }

  if (isCsvMimeType(mimeType)) {
    const buffer = await fetchFileBuffer(attachment);
    return {
      content: parseCsvFile(buffer, filename),
      extractionType: 'csv',
    };
  }

  if (mimeType === 'application/pdf') {
    return { content: null, extractionType: 'binary_ref' };
  }

  // Binary files (images, video, audio) — no text extraction
  return { content: null, extractionType: 'binary_ref' };
}

// ─── Persistence ────────────────────────────────────────────────────

/**
 * Update the extracted content on an AiMessageFile row
 */
export async function persistExtraction(
  messageFileId: string,
  content: string | null,
  extractionType: string,
): Promise<void> {
  const prisma = getPrisma();
  await prisma.aiMessageFile.update({
    where: { id: messageFileId },
    data: {
      extractedContent: content,
      extractionType,
      extractedAt: new Date(),
    },
  });
}

/**
 * Extract and persist content for all file attachments on a newly created message.
 * Returns a map of fileId → extracted content for immediate use.
 */
export async function extractAndPersistForMessage(
  attachments: Array<{
    id: string;
    fileId: string;
    key: string;
    bucket: string;
    region: string;
    mimeType: string;
    filename: string;
  }>,
): Promise<Map<string, ExtractionResult>> {
  const results = new Map<string, ExtractionResult>();

  await Promise.all(
    attachments.map(async (att) => {
      const fileAttachment: FileAttachment = {
        key: att.key,
        bucket: att.bucket,
        region: att.region,
        mimeType: att.mimeType,
        filename: att.filename,
      };

      const extraction = await extractFileContent(fileAttachment);
      await persistExtraction(att.id, extraction.content, extraction.extractionType);
      results.set(att.fileId, extraction);
    }),
  );

  return results;
}

// ─── LangChain message building ─────────────────────────────────────

/** Content part types for multimodal messages */
type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: string } };

/**
 * Build LangChain history messages from DB history using cached extracted content.
 * Text-extractable files use cached content (no S3 calls).
 * Binary files get a text placeholder with fileId for the reread_file tool.
 * If extractedContent is null for a text-extractable file, falls back to S3 (lazy backfill).
 */
export async function buildHistoryMessages(history: HistoryMessage[]): Promise<BaseMessage[]> {
  return Promise.all(
    history.map(async (msg) => {
      if (msg.role === 'assistant') {
        return new AIMessage(msg.content);
      }

      // User message without attachments
      if (!msg.attachments || msg.attachments.length === 0) {
        return new HumanMessage(msg.content);
      }

      // User message with attachments — use cached content
      const contentParts: ContentPart[] = [{ type: 'text', text: msg.content }];

      for (const att of msg.attachments) {
        if (att.extractedContent) {
          // Cached extraction available — use it directly
          contentParts.push({ type: 'text', text: att.extractedContent });
        } else if (isTextExtractable(att.mimeType)) {
          // No cache yet — lazy backfill from S3
          const extraction = await extractFileContent({
            key: att.key,
            bucket: att.bucket,
            region: att.region,
            mimeType: att.mimeType,
            filename: att.filename,
          });
          if (extraction.content) {
            contentParts.push({ type: 'text', text: extraction.content });
            // Persist for next time (fire and forget)
            if (att.id) {
              persistExtraction(att.id, extraction.content, extraction.extractionType).catch(console.error);
            }
          }
        } else {
          // Binary file — insert placeholder
          contentParts.push({
            type: 'text',
            text: `[Previously attached ${att.mimeType.split('/')[0]}: ${att.filename}, fileId: ${att.fileId} — use reread_file tool to re-examine if needed]`,
          });
        }
      }

      return new HumanMessage({ content: contentParts });
    }),
  );
}

/**
 * Build the current user's HumanMessage with file content.
 * For text-extractable files, uses the extracted text content.
 * For binary files (images, video, audio, PDF), sends base64 data URL + fileId annotation.
 *
 * @param extractedContents - Pre-extracted content map (fileId → result) to avoid double S3 downloads
 */
export async function buildCurrentUserMessage(
  text: string,
  attachments?: FileAttachment[],
  extractedContents?: Map<string, ExtractionResult>,
): Promise<HumanMessage> {
  if (!attachments || attachments.length === 0) {
    return new HumanMessage(text);
  }

  const contentParts: ContentPart[] = [{ type: 'text', text }];

  for (const attachment of attachments) {
    // Use pre-extracted content if available (text-extractable files)
    const extracted = attachment.fileId ? extractedContents?.get(attachment.fileId) : undefined;

    if (extracted?.content) {
      contentParts.push({ type: 'text', text: extracted.content });
      continue;
    }

    // Text-extractable file without cached content — extract now
    if (isTextExtractable(attachment.mimeType)) {
      const extraction = await extractFileContent(attachment);
      if (extraction.content) {
        contentParts.push({ type: 'text', text: extraction.content });
      }
      continue;
    }

    // Binary files — send base64 with fileId annotation
    const fileIdAnnotation = attachment.fileId
      ? `[Attached ${attachment.mimeType.startsWith('image/') ? 'image' : attachment.mimeType.split('/')[0]}: ${attachment.filename}, fileId: ${attachment.fileId}]`
      : '';

    if (fileIdAnnotation) {
      contentParts.push({ type: 'text', text: fileIdAnnotation });
    }

    if (attachment.mimeType.startsWith('image/')) {
      const dataUrl = await fetchFileAsBase64DataUrl(attachment);
      contentParts.push({
        type: 'image_url',
        image_url: { url: dataUrl, detail: 'auto' },
      });
    } else if (
      attachment.mimeType.startsWith('video/') ||
      attachment.mimeType.startsWith('audio/') ||
      attachment.mimeType === 'application/pdf'
    ) {
      const dataUrl = await fetchFileAsBase64DataUrl(attachment);
      contentParts.push({
        type: 'image_url',
        image_url: { url: dataUrl },
      });
    }
  }

  return new HumanMessage({ content: contentParts });
}
