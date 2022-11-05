import { CompanyCertEntity } from '../../../../modules/esocial/entities/companyCert.entity';
export interface IConvertPfx {
  file: Express.Multer.File;
  password: string;
}

export interface IConvertPfxReturn {
  certificate: string;
  key: string;
  notAfter: Date;
  notBefore: Date;
}

export interface ISignEvent {
  cert: CompanyCertEntity;
  xml: string;
}

interface IIdOptions {
  type?: number;
  seqNum?: number;
  index?: number;
}
interface IESocialMethodProvider {
  convertPfxToPem(data: IConvertPfx): Promise<IConvertPfxReturn>;
  generateId(cpfCnpj: string, options?: IIdOptions): void;
}

export { IESocialMethodProvider as IESocialEventProvider, IIdOptions };
