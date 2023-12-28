import { ICreatePGR } from './../../../docx/builders/pgr/types/pgr.types';
import { ISectionOptions, Packer } from 'docx';
import { writeFileSync, unlinkSync } from 'fs';

import { IDocumentAttachment, IDocumentFactoryProduct as IDocumentFactoryProduct, IUnlinkPaths } from '../types/IDocumentFactory.types';
import { IStorageProvider } from './../../../../../shared/providers/StorageProvider/models/StorageProvider.types';
import { AttachmentEntity } from './../../../../sst/entities/attachment.entity';
import { baseDocuemntOptions, createBaseDocument } from './../../../docx/base/config/document';
import { ServerlessLambdaProvider } from '../../../../../shared/providers/ServerlessFunctionsProvider/implementations/ServerlessLambda/ServerlessLambdaProvider';

export abstract class DocumentFactoryAbstractionCreator<T, R> {
  public abstract factoryMethod(body: T): IDocumentFactoryProduct<T, R>;

  constructor(
    private readonly amazonStorageProvider: IStorageProvider,
    private readonly serverlessLambdaProvider: ServerlessLambdaProvider,
  ) {

  }

  public create(body: T) {
    const product = this.factoryMethod(body);
    return product;
  }

  public async execute(body: T) {
    const product = this.create(body);
    const isLocal = process.env.APP_HOST.includes('localhost');

    try {
      if (isLocal) console.log(1, 'start')
      const data = await product.getData(body);
      const version = product.getVersionName(data, body);
      const attachmentsData = await product.getAttachments({ data, attachments: [], body, version });
      const attachments = await this.saveAttachments(attachmentsData, product, body);
      if (isLocal) console.log(2, 'attachments')

      const { url, buffer, fileName } = await this.save(product, {
        body,
        getBuild: async () => product.getDocumentBuild({ data, attachments, body, version }),
        getSections: async () => product.getDocumentSections({ data, attachments, body, version }),
        type: product.type
      });
      if (isLocal) console.log(3, url)

      await product.save({ body, attachments, url, data });

      if (product.localCreation) {
        this.unlinkFiles(product.unlinkPaths);
      }
      if (isLocal) console.log(4, 'unlinked')

      return { buffer, fileName };
    } catch (error) {
      if (product.localCreation) {
        this.unlinkFiles(product.unlinkPaths);
      }

      product.error({ body });
      throw error;
    }
  }

  private async saveAttachments(attachments: IDocumentAttachment[], product: IDocumentFactoryProduct<T>, body: T) {
    const attachmentsEntity = await Promise.all(
      attachments.map(async (attachment) => {
        const { url } = await this.save(product, {
          body,
          getBuild: async () => attachment.buildData,
          getSections: async () => attachment.section,
          type: attachment.type,
        });
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

  private async save(product: IDocumentFactoryProduct<T>, { body, type, getBuild, getSections, }: { body: T; type?: string; getBuild: () => Promise<ICreatePGR>; getSections: () => Promise<ISectionOptions[]> }) {
    if (product.localCreation) {
      const documentSections = await getSections();
      const save = await this.saveWithSections(product, documentSections, { body, type });

      return { url: save.url, buffer: save.buffer, fileName: save.fileName };
    } else {
      const buildData = await getBuild();

      // save buildData in file as text
      writeFileSync('tmp/buildData.txt', JSON.stringify(buildData));
      throw new Error('Not implemented yet');

      const save = await this.saveWithLambda(product, buildData, { body, type });

      return { url: save.url, buffer: save.buffer, fileName: save.fileName };
    }
  }

  private async saveWithLambda(product: IDocumentFactoryProduct<T>, buildData: ICreatePGR, options: { type?: string; body: T }) {
    const fileName = product.getFileName(options.body, options.type);

    const isDev = process.env.APP_HOST.includes('localhost');

    const body = {
      isDev,
      fileName,
      buildData,
      docOptions: baseDocuemntOptions,
      photos: product.unlinkPaths
    }

    // const buffer = Buffer.from(JSON.stringify(body));
    // const { key: s3BodyKey } = await this.upload(buffer, v4() + '.txt');

    // console.log(s3BodyKey)

    const { url } = await this.serverlessLambdaProvider.createDocument({
      body,
      // body: {
      //   isDev,
      //   s3BodyKey
      // }
    });

    // const { url } = await this.serverlessLambdaProvider.createDocument({
    //   body
    // });

    return { url, buffer: null, fileName };

  }

  private async saveWithSections(product: IDocumentFactoryProduct<T>, sections: ISectionOptions[], options: { type?: string; body: T; localCreation?: boolean }) {
    const fileName = product.getFileName(options.body, options.type);
    const Doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(Doc);
    const buffer = Buffer.from(b64string, 'base64');

    const { url } = await this.upload(buffer, fileName);

    return { url, buffer, fileName };
  }

  async upload(fileBuffer: Buffer, fileName: string) {
    const { url, key } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
      fileName: 'temp-files-7-days/' + fileName,
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
