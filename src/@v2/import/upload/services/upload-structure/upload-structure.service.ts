import { Injectable } from '@nestjs/common';
import { NodeXMLAdapter } from '../../adapters/xml/node-xml.adapter';
import { IUploadStructureService } from './upload-structure.service.types';

@Injectable()
export class UploadStructureService {
  constructor(private readonly xmlAdapter: NodeXMLAdapter) {}

  async upload<T>(params: IUploadStructureService.Params<T>): IUploadStructureService.Result {
    const data = await this.xmlAdapter.read(params.buffer);

    await params.product.validate(data, params.data);

    return [, null];
  }
}
