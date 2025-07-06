import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { IUploadFactoryProduct } from '../../products/types/upload-product.interface';

export namespace IUploadStructureService {
  export type Params<T> = {
    product: IUploadFactoryProduct<T>;
    buffer: Buffer;
    data: T;
  };

  export type Result = Promise<DomainResponse<void>>;
}
