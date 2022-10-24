export interface IAddCertification {}

interface IESocialEventProvider {
  addCertification(data: IAddCertification): Promise<void>;
}

export { IESocialEventProvider };
