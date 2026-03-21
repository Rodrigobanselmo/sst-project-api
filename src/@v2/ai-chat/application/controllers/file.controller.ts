import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { AiFileRepository } from '../../database/repositories/ai-file.repository';
import { S3StorageAdapter } from '@/@v2/shared/adapters/storage/s3.storage.adapter';
import { config } from '@/@v2/shared/constants/config';

// Supported MIME types for AI chat (matches takehome)
const AI_CHAT_SUPPORTED_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'],
  video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'video/x-matroska'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/ogg', 'audio/webm', 'audio/mp4'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  text: ['text/plain'],
  spreadsheet: ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

// Fine-grained size limits per type (matches takehome)
const MAX_SIZE_BY_TYPE: Record<string, number> = {
  image: 20 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  audio: 25 * 1024 * 1024,
  document: 50 * 1024 * 1024,
  text: 10 * 1024 * 1024,
  spreadsheet: 25 * 1024 * 1024,
};

function getFileCategory(mimeType: string): string | null {
  for (const [category, types] of Object.entries(AI_CHAT_SUPPORTED_TYPES)) {
    if (types.some((t) => mimeType.startsWith(t) || mimeType === t)) {
      return category;
    }
  }
  return null;
}

@Controller('ai-chat/files')
export class FileController {
  private readonly s3: S3StorageAdapter;

  constructor(private readonly aiFileRepository: AiFileRepository) {
    this.s3 = new S3StorageAdapter();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB hard limit (max of all categories)
      },
    }),
  )
  async upload(@User() user: UserPayloadDto, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file provided');

    const category = getFileCategory(file.mimetype);
    if (!category) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}. Supported: images, videos, audio, PDF, Word, TXT, CSV, Excel.`);
    }

    const maxSize = MAX_SIZE_BY_TYPE[category] || 20 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`File too large. Maximum size for ${category} is ${Math.round(maxSize / (1024 * 1024))}MB`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeFilename = file.originalname
      .normalize('NFD')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    const folder = `ai-chat/${user.userId}/`;
    const fileName = `${timestamp}_${safeFilename}`;
    const { bucket, key: actualKey } = await this.s3.upload({
      file: file.buffer,
      fileFolder: folder,
      fileName: `${timestamp}_${safeFilename}`,
      isPublic: false,
    });

    const record = await this.aiFileRepository.create({
      key: actualKey,
      bucket,
      region: config.AWS.S3_BUCKET_REGION,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploaderId: user.userId,
    });

    const url = await this.s3.generateSignedPath({ fileKey: actualKey, expires: 3600 });

    return { ...record, url };
  }

  @Get(':id/url')
  async getUrl(@User() user: UserPayloadDto, @Param('id') id: string) {
    const file = await this.aiFileRepository.findById(id);
    if (!file) throw new NotFoundException('File not found');
    const url = await this.s3.generateSignedPath({ fileKey: file.key, expires: 3600 });
    return { url };
  }
}
