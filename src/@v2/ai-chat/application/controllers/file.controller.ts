import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { AiFileRepository } from '../../database/repositories/ai-file.repository';
import { S3StorageAdapter } from '@/@v2/shared/adapters/storage/s3.storage.adapter';
import { config } from '@/@v2/shared/constants/config';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

@Controller('ai-chat/files')
export class FileController {
  private readonly s3: S3StorageAdapter;

  constructor(private readonly aiFileRepository: AiFileRepository) {
    this.s3 = new S3StorageAdapter();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@User() user: UserPayloadDto, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file provided');
    if (file.size > MAX_FILE_SIZE) throw new BadRequestException('File too large (max 20MB)');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeFilename = file.originalname
      .normalize('NFD')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    const folder = `ai-chat/${user.userId}/`;
    const fileName = `${timestamp}_${safeFilename}`;
    const key = `${folder}${fileName}`;

    const { bucket } = await this.s3.upload({
      file: file.buffer,
      fileFolder: folder,
      fileName: `${timestamp}_${safeFilename}`,
      isPublic: false,
    });

    // The S3 adapter normalizes the file name and prepends the folder,
    // but we already pre-normalized safeFilename, so the stored key matches.
    const url = await this.s3.generateSignedPath({ fileKey: key, expires: 3600 });

    const record = await this.aiFileRepository.create({
      key,
      bucket,
      region: config.AWS.S3_BUCKET_REGION,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploaderId: user.userId,
    });

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
