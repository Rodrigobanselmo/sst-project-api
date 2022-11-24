import { IPdfAsoData } from '../../aso/types/IAsoData.type';
import { IPdfProntuarioData } from '../../prontuario/types/IProntuarioData.type';

export interface IPdfKitData {
  aso: IPdfAsoData;
  prontuario: IPdfProntuarioData;
}
