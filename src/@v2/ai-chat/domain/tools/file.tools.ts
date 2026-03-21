import { tool, type StructuredToolInterface } from '@langchain/core/tools';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from '@/@v2/shared/constants/config';
import { extractFileContent, fetchFileAsBase64DataUrl, type FileAttachment } from '../file-processing';

// Lazy PrismaClient singleton
let _prisma: PrismaClient | null = null;
function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

/**
 * Schema field that instructs the LLM to provide a user-friendly description
 * of what it's doing with this tool call.
 */
const actionDescriptionField = z
  .string()
  .describe(
    'IMPORTANT: Write a brief, user-friendly description of what you are doing. ' +
      'MUST be in the SAME LANGUAGE the user is chatting in (detect from conversation history). ' +
      'Be specific and contextual. ' +
      "Examples: Portuguese: 'Relendo arquivo receitas.xlsx', English: 'Re-reading file photo.jpg'.",
  );

/**
 * Marker prefix for binary tool results that need to be injected as image_url.
 * The agent detects this and injects the image into the conversation properly.
 */
export const BINARY_RESULT_PREFIX = '__BINARY_FILE__:';

/**
 * Creates file-related tools available to all agents.
 * These tools handle re-reading previously attached files.
 */
export function createFileTools(userId: number): StructuredToolInterface[] {
  const rereadFileTool = tool(
    async ({ fileId }: { _actionDescription: string; fileId: string }) => {
      const prisma = getPrisma();
      const file = await prisma.aiFile.findFirst({
        where: { id: fileId, deleted_at: null },
      });

      if (!file) {
        return JSON.stringify({
          error: true,
          message: `File not found: ${fileId}`,
        });
      }

      if (file.uploaderId !== userId) {
        return JSON.stringify({
          error: true,
          message: "You don't have access to this file",
        });
      }

      const attachment: FileAttachment = {
        key: file.key,
        bucket: file.bucket || config.AWS.S3_BUCKET,
        region: file.region || config.AWS.S3_BUCKET_REGION,
        mimeType: file.mimeType,
        filename: file.filename,
      };

      // For binary files (images, etc.), fetch base64 and return with a special prefix.
      // The agent will detect this prefix and inject the image as a proper image_url
      // content part so the LLM can actually "see" it visually.
      if (
        file.mimeType.startsWith('image/') ||
        file.mimeType.startsWith('video/') ||
        file.mimeType.startsWith('audio/') ||
        file.mimeType === 'application/pdf'
      ) {
        const dataUrl = await fetchFileAsBase64DataUrl(attachment);
        return `${BINARY_RESULT_PREFIX}${JSON.stringify({
          filename: file.filename,
          mimeType: file.mimeType,
          dataUrl,
        })}`;
      }

      // For text-extractable files, extract and return the content directly
      const extraction = await extractFileContent(attachment);
      return JSON.stringify({
        filename: file.filename,
        mimeType: file.mimeType,
        type: 'text',
        content: extraction.content ?? `Could not extract text from ${file.filename}`,
      });
    },
    {
      name: 'reread_file',
      description:
        'Re-read a file that was previously attached to this conversation. ' +
        'Use this when you need to re-examine a file\'s content, look at specific details, ' +
        'or when the conversation history only shows a summary/placeholder for a file. ' +
        'Returns the full file content. For images, the image will be loaded into the conversation so you can see it.',
      schema: z.object({
        _actionDescription: actionDescriptionField,
        fileId: z
          .string()
          .describe(
            'The file ID to re-read. You can find file IDs in the [Previously attached ...] or [Attached ...] annotations in conversation history.',
          ),
      }),
    },
  );

  return [rereadFileTool];
}
