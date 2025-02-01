import { AttachmentEntity } from '@/@v2/documents/domain/entities/attachment.entity';
import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { BUCKET_FOLDERS } from '@/@v2/shared/constants/buckets';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { isDevelopmentGetter } from '@/@v2/shared/utils/helpers/is-development';
import { Inject, Injectable } from '@nestjs/common';
import { ISectionOptions, Packer } from 'docx';
import { unlinkSync } from 'fs';
import { IDocumentAttachment, IDocumentFactoryProduct, IUnlinkPaths } from '../../factories/document/types/document-factory.types';

import internal, { Readable } from 'stream';
import { createBaseDocument } from '../../libs/docx/base/config/document';
import { IDocumentCreation } from './document-creation.interface';

@Injectable()
export class DocumentCreationService {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
  ) {}

  private isLocal = isDevelopmentGetter();

  public async execute<T, R>({ product, body }: IDocumentCreation.Params<T, R>) {
    try {
      if (this.isLocal) console.log(1, 'start');
      const data = await product.getData(body);
      const attachmentsData = await product.getAttachments({ data, body });
      const attachments = await this.saveAttachments<T, R>(attachmentsData, product, data);
      if (this.isLocal) console.log(2, 'attachments');

      const sections = await product.getSections({ data, attachments: attachmentsData.map((attachment) => attachment.model), body });
      const fileName = product.getFileName(data);

      const { stream } = this.generate({ sections });
      const { url } = await this.upload(stream, fileName);

      if (this.isLocal) console.log(3, url);

      await product.save({ body, attachments, url, data });

      this.unlinkFiles(product.unlinkPaths);
      if (this.isLocal) console.log(4, 'unlinked');
    } catch (error) {
      this.unlinkFiles(product.unlinkPaths);

      product.error({ body });
      throw error;
    }
  }

  private async saveAttachments<T, R>(attachments: IDocumentAttachment[], product: IDocumentFactoryProduct<T>, data: R) {
    const attachmentsEntities: AttachmentEntity[] = [];

    for (let index = 0; index < attachments.length; index++) {
      const attachment = attachments[index];

      if (this.isLocal) console.log('attachments start', index);
      const { stream } = this.generate({ sections: attachment.section });
      if (this.isLocal) console.log('attachments end', index);

      const { url } = await this.upload(stream, product.getFileName(data, attachment.model.type));

      attachmentsEntities.push(
        new AttachmentEntity({
          id: attachment.id,
          name: attachment.model.name,
          url,
        }),
      );
    }

    return attachmentsEntities;
  }

  private generate({ sections }: { sections: ISectionOptions[] }) {
    const Doc = createBaseDocument(sections);
    const stream = Packer.toStream(Doc);
    const readableStream = new Readable({
      read() {
        stream.on('data', (chunk) => {
          this.push(chunk);
        });

        stream.on('end', () => {
          this.push(null);
        });

        stream.on('error', (err) => {
          this.emit('error', err);
        });
      },
    });

    return { stream: readableStream };
  }

  private async upload(fileStream: internal.Readable, fileName: string) {
    const { url, key } = await this.storage.upload({
      file: fileStream,
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
        } catch (e) {}
      });
  }
}
