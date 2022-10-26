export interface IAddCertification {}

interface IIdOptions {
  type?: number;
  seqNum?: number;
}
interface IESocialEventProvider {
  addCertification(data: IAddCertification): Promise<void>;
  generateId(cpfCnpj: string, options?: IIdOptions): void;
}

export { IESocialEventProvider, IIdOptions };
