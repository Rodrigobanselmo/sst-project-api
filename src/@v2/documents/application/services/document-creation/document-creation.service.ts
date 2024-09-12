import { ISectionOptions, Packer } from 'docx';
import { unlinkSync } from 'fs';
import { IDocumentAttachment, IDocumentFactoryProduct, IUnlinkPaths } from '../../factories/document/types/document-factory.types';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject } from '@nestjs/common';
import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { isDevelopment } from '@/@v2/shared/utils/helpers/is-development';
import { createBaseDocument } from '../../libs/docx/base/config/document';
import { IDocumentCreation } from './document-creation.interface';
import { BUCKET_FOLDERS } from '@/@v2/shared/constants/buckets';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';
import { AttachmentEntity } from '@/@v2/documents/domain/entities/attachment.entity';

export abstract class DocumentCreationService {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
  ) { }

  public async execute<T>({ product, body }: IDocumentCreation.Params<T>) {
    const isLocal = isDevelopment();

    try {
      if (isLocal) console.log(1, 'start');
      const data = await product.getData(body);
      const attachmentsData = await product.getAttachments({ data, body });
      const attachments = await this.saveAttachments<T>(attachmentsData, product, body);
      if (isLocal) console.log(2, 'attachments');

      const sections = await product.getSections({ data, attachments: AttachmentModel.fromEntities(attachments), body })
      const fileName = product.getFileName(body);

      const { buffer } = await this.generate({ sections });
      const { url } = await this.upload(buffer, fileName);

      if (isLocal) console.log(3, url);

      await product.save({ body, attachments, url, data });

      this.unlinkFiles(product.unlinkPaths);
      if (isLocal) console.log(4, 'unlinked');

      return { buffer, fileName };
    } catch (error) {
      this.unlinkFiles(product.unlinkPaths);

      product.error({ body });
      throw error;
    }
  }

  private async saveAttachments<T>(attachments: IDocumentAttachment[], product: IDocumentFactoryProduct<T>, body: T) {
    const attachmentsEntity = await Promise.all(
      attachments.map(async (attachment) => {
        const { buffer } = await this.generate({ sections: attachment.section });
        const { url } = await this.upload(buffer, product.getFileName(body, attachment.type));

        return new AttachmentEntity({
          id: attachment.id,
          name: attachment.name,
          url,
        });
      }),
    );

    return attachmentsEntity;
  }

  private async generate({ sections }: { sections: ISectionOptions[]; }) {
    const Doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(Doc);
    const buffer = Buffer.from(b64string, 'base64');

    return { buffer };
  }

  private async upload(fileBuffer: Buffer, fileName: string) {
    const { url, key } = await this.storage.upload({
      file: fileBuffer,
      fileName: BUCKET_FOLDERS.TEMP_FILES_7 + fileName,
    });

    return { url, key };
  }

  public async unlinkFiles(paths: IUnlinkPaths[]) {
    paths
      .filter((i) => !!i?.path && typeof i.path == 'string')
      .forEach((path) => {
        try {
          unlinkSync(path.path);
        } catch (e) { }
      });
  }
}
