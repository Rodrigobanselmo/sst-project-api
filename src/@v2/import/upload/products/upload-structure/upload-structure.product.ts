import { Injectable } from '@nestjs/common';

import { XMLAdapter } from '../../adapters/xml/xml.interface';
import { IUploadFactoryProduct } from '../types/upload-product.interface';
import { IStructureProductParams } from './upload-structure.product.types';

@Injectable()
export class UploadStructureProduct implements IUploadFactoryProduct {
  async validate(data: XMLAdapter.ReadResult[], params: IStructureProductParams) {
    console.log('data', data);
    console.log('params', params);

    return Promise.resolve();
  }
}
