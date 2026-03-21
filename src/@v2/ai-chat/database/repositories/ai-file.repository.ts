import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

export interface AiFileRecord {
  id: string;
  key: string;
  bucket: string;
  region: string;
  filename: string;
  mimeType: string;
  size: number;
  uploaderId: number;
  createdAt: Date;
}

@Injectable()
export class AiFileRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async create(data: {
    key: string;
    bucket: string;
    region: string;
    filename: string;
    mimeType: string;
    size: number;
    uploaderId: number;
  }): Promise<AiFileRecord> {
    const file = await this.prisma.aiFile.create({ data });
    return this.map(file);
  }

  async findById(id: string): Promise<AiFileRecord | null> {
    const file = await this.prisma.aiFile.findFirst({
      where: { id, deleted_at: null },
    });
    return file ? this.map(file) : null;
  }

  async findByIds(ids: string[]): Promise<AiFileRecord[]> {
    const files = await this.prisma.aiFile.findMany({
      where: { id: { in: ids }, deleted_at: null },
    });
    return files.map((f) => this.map(f));
  }

  private map(raw: any): AiFileRecord {
    return {
      id: raw.id,
      key: raw.key,
      bucket: raw.bucket,
      region: raw.region,
      filename: raw.filename,
      mimeType: raw.mimeType,
      size: raw.size,
      uploaderId: raw.uploaderId,
      createdAt: raw.created_at,
    };
  }
}
