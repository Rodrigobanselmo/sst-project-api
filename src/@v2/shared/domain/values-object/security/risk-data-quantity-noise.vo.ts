import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { valuesCheck } from "../../functions/security/values-check.func";

export type IRiskDataQuantityNoiseVO = {
  ltcatq3?: string;
  ltcatq5?: string;
  nr15q5?: string;
  type: QuantityTypeEnum.NOISE;
  /** NR-15 appendix number (e.g., "1" for Ruído Contínuo, "2" for Ruído de Impacto) */
  appendix?: string;
}

export class RiskDataQuantityNoiseVO {
  // Anexo 1 - Ruído Contínuo/Intermitente: limite 85 dB(A)
  private limitQ3ListAnexo1 = [75, 79, 82, 85, 115, 10000000];
  private limitQ5ListAnexo1 = [64.4, 75, 80, 85, 115, 10000000];

  // Anexo 2 - Ruído de Impacto: limite 120 dB(C)
  // Values scaled so that probability >= 5 means value >= 120 dB(C)
  // The valuesCheck function returns index+1 when value < limits[index]
  // So for value >= 120, it should return 5 (index 4+1 when value >= limits[3] but < limits[4])
  // limits[3] = 120 means: if value >= 120 and < 140, return 5
  private limitQ3ListAnexo2 = [100, 105, 110, 120, 140, 10000000];
  private limitQ5ListAnexo2 = [100, 105, 110, 120, 140, 10000000];

  ltcatq3?: string;
  ltcatq5?: string;
  nr15q5?: string;
  type: QuantityTypeEnum.NOISE;
  appendix?: string;

  constructor(params: IRiskDataQuantityNoiseVO) {
    this.ltcatq3 = params.ltcatq3;
    this.ltcatq5 = params.ltcatq5;
    this.nr15q5 = params.nr15q5;
    this.type = params.type;
    this.appendix = params.appendix;
  }

  private get isRuidoImpacto() {
    return this.appendix === '2';
  }

  private get limitQ3List() {
    return this.isRuidoImpacto ? this.limitQ3ListAnexo2 : this.limitQ3ListAnexo1;
  }

  private get limitQ5List() {
    return this.isRuidoImpacto ? this.limitQ5ListAnexo2 : this.limitQ5ListAnexo1;
  }

  get probability() {
    return Math.max(this.ltcatq3Prob, this.ltcatq5Prob, this.nr15q5Prob)
  }

  get ltcatq3Prob() {
    return valuesCheck({ value: this.ltcatq3, limits: this.limitQ3List });
  }

  get ltcatq5Prob() {
    return valuesCheck({ value: this.ltcatq5, limits: this.limitQ5List });
  }

  get nr15q5Prob() {
    return valuesCheck({ value: this.nr15q5, limits: this.limitQ5List });
  }

}
