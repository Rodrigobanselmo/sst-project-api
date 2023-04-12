import { ISectionOptions, Packer } from 'docx';
import fs from 'fs';

import { IDocumentAttachment, IDocumentFactoryProduct as IDocumentFactoryProduct } from '../types/IDocumentFactory.types';
import { IStorageProvider } from './../../../../../shared/providers/StorageProvider/models/StorageProvider.types';
import { AttachmentEntity } from './../../../../sst/entities/attachment.entity';
import { createBaseDocument } from './../../../docx/base/config/document';

export abstract class DocumentFactoryAbstractionCreator<T, R> {
  public abstract factoryMethod(body: T): IDocumentFactoryProduct<T, R>;

  constructor(private readonly amazonStorageProvider: IStorageProvider) {}

  public create(body: T) {
    const product = this.factoryMethod(body);
    return product;
  }

  public async execute(body: T) {
    const product = this.create(body);

    try {
      const data = await product.getData(body);
      const attachmentsData = await product.getAttachments(data, body);
      const attachments = await this.saveAttachments(attachmentsData, product, body);
      const version = product.getVersionName(data, body);

      const documentSections = await product.getDocument({ data, attachments, body, version });
      const { url, buffer, fileName } = await this.save(product, documentSections, { body });

      await product.save({ body, attachments, url, data });
      this.unlinkFiles(product.unlinkPaths);

      return { buffer, fileName };
    } catch (error) {
      this.unlinkFiles(product.unlinkPaths);
      product.error({ body });

      throw error;
    }
  }

  private async saveAttachments(attachments: IDocumentAttachment[], product: IDocumentFactoryProduct<T>, body: T) {
    const attachmentsEntity = await Promise.all(
      attachments.map(async (attachment) => {
        const { url } = await this.save(product, attachment.section, { type: attachment.type, body });
        return new AttachmentEntity({
          id: attachment.id,
          name: attachment.name,
          url,
          link: attachment.link,
        });
      }),
    );

    return attachmentsEntity;
  }

  private async save(product: IDocumentFactoryProduct<T>, sections: ISectionOptions[], options: { type?: string; body: T }) {
    const Doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(Doc);
    const buffer = Buffer.from(b64string, 'base64');

    const fileName = product.getFileName(options.body, options.type);

    const url = await this.upload(buffer, fileName);

    return { url, buffer, fileName };
  }

  async upload(fileBuffer: Buffer, fileName: string) {
    const { url } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
      fileName: 'temp-files-7-days/' + fileName,
    });

    return url;
  }

  public async unlinkFiles(paths: string[]) {
    paths
      .filter((i) => !!i && typeof i == 'string')
      .forEach((path) => {
        try {
          fs.unlinkSync(path);
        } catch (e) {}
      });
  }
}
