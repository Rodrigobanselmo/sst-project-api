import { Injectable } from '@nestjs/common';
import { Packer } from 'docx';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { v4 } from 'uuid';
import * as path from 'path';
import axios from 'axios';

import { coverSections } from '@/@v2/documents/libs/docx/base/layouts/cover/cover';
import { createBaseDocument } from '@/@v2/documents/libs/docx/base/config/document';

export interface PreviewCoverDto {
  logoUrl?: string;
  backgroundImageUrl?: string;
  title?: string;
  version?: string;
  companyName?: string;
  coverProps?: {
    logoProps?: {
      x?: number;
      y?: number;
      maxLogoWidth?: number;
      maxLogoHeight?: number;
    };
    titleProps?: {
      x?: number;
      y?: number;
      boxX?: number;
      boxY?: number;
      size?: number;
      color?: string;
      bold?: boolean;
    };
    versionProps?: {
      x?: number;
      y?: number;
      boxX?: number;
      boxY?: number;
      size?: number;
      color?: string;
    };
    companyProps?: {
      x?: number;
      y?: number;
      boxX?: number;
      boxY?: number;
      size?: number;
      color?: string;
    };
  };
}

@Injectable()
export class PreviewDocumentCoverService {
  private tempPaths: string[] = [];

  async execute(data: PreviewCoverDto): Promise<{ buffer: Buffer; fileName: string }> {
    try {
      // Ensure temp directory exists
      const tempDir = path.join(process.cwd(), 'tmp');
      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
      }

      // Download background image from URL
      let backgroundImagePath: string | undefined;
      if (data.backgroundImageUrl) {
        backgroundImagePath = await this.downloadToTemp(data.backgroundImageUrl);
      }

      // Download logo from URL
      let logoPath: string | undefined;
      if (data.logoUrl) {
        logoPath = await this.downloadToTemp(data.logoUrl);
      }

      // Create cover section
      const section = coverSections({
        version: data.version || '',
        companyName: data.companyName || '',
        title: data.title || 'Título do Documento',
        imgPath: logoPath,
        coverProps: {
          ...(data.coverProps || {}),
          backgroundImagePath,
        } as any,
      });

      // Generate DOCX
      const doc = createBaseDocument([section]);
      const b64string = await Packer.toBase64String(doc);
      const buffer = Buffer.from(b64string, 'base64');

      return { buffer, fileName: 'cover-preview.docx' };
    } finally {
      // Cleanup temp files
      this.cleanup();
    }
  }

  private async downloadToTemp(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const ext = url.split('.').pop()?.split('?')[0] || 'png';
    const tempPath = path.join(process.cwd(), 'tmp', `${v4()}.${ext}`);
    writeFileSync(tempPath, Buffer.from(response.data));
    this.tempPaths.push(tempPath);
    return tempPath;
  }

  private cleanup(): void {
    this.tempPaths.forEach((tempPath) => {
      try {
        if (existsSync(tempPath)) {
          unlinkSync(tempPath);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    });
    this.tempPaths = [];
  }
}