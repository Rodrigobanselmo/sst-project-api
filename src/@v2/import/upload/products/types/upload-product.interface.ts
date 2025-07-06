import { XMLAdapter } from '../../adapters/xml/xml.interface';

export interface IUploadFactoryProduct<T = any> {
  validate(data: XMLAdapter.ReadResult[], params: T): Promise<void>;
}
