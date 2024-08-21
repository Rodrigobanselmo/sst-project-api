import { heatTableLEOConstant, heatTableLIIConstant, heatTableNAConstant, heatTableTETOConstant } from "../../constants/security/heat-table.constant";
import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { mapCheck } from "../../functions/security/map-check.func";
import { valuesCheck } from "../../functions/security/values-check.func";

export type IRiskDataQuantityHeatVO = {
  ibtug?: number;
  mw?: number;
  isAcclimatized?: boolean;
  type: QuantityTypeEnum.HEAT;
  clothesType?: number;
}

export class RiskDataQuantityHeatVO {
  mw?: number;
  isAcclimatized?: boolean;
  type: QuantityTypeEnum.HEAT;

  #clothesType?: number;
  #ibtug?: number;

  constructor(params: IRiskDataQuantityHeatVO) {
    this.#ibtug = params?.ibtug;
    this.#clothesType = params.clothesType;

    this.mw = params.mw;
    this.isAcclimatized = params.isAcclimatized;
    this.type = params.type;
  }

  get ibtug() {
    return Number(this.#ibtug || 0) + Number(this.#clothesType || 0);
  }

  get probability() {
    if (!this.mw || !this.ibtug) return 0;

    const ibtugTETO = this.ibtugTETO;
    const ibtugNA = this.ibtugNA;

    if (!ibtugTETO || !ibtugNA) return 0;
    if (ibtugTETO.ibtug <= this.ibtug) return 6;

    if (!ibtugNA) return 0;

    if (!this.isAcclimatized) {

      const ibtugNAList = [
        ibtugNA.ibtug - 2,
        ibtugNA.ibtug - 1.5,
        ibtugNA.ibtug - 1,
        ibtugNA.ibtug - 0.5,
        ibtugNA.ibtug,
        10000,
      ];

      return valuesCheck({ value: String(this.ibtug), limits: ibtugNAList, highValue: 5 });
    }

    const ibtugLII = this.ibtugLII;
    if (!ibtugLII) return 0;

    if (this.ibtug <= this.ibtugNA.ibtug) return 1;
    if (this.ibtug > this.ibtugNA.ibtug && this.ibtug <= ibtugLII.ibtugLII) return 2;

    const ibtugLEO = this.ibtugLEO;
    if (!ibtugLEO) return 0;

    if (this.ibtug > ibtugLEO.ibtug) return 5;
    if (this.ibtug >= ibtugLII.ibtugLSI && this.ibtug <= ibtugLEO.ibtug) return 4;
    if (this.ibtug > ibtugLII.ibtugLII && this.ibtug < ibtugLII.ibtugLSI) return 3;

    return 0;
  }

  get ibtugLEO() {
    if (!this.mw) return null;
    return mapCheck(this.mw, 100, 606, heatTableLEOConstant);
  }

  get ibtugTETO() {
    if (!this.mw) return null;
    return mapCheck(this.mw, 240, 607, heatTableTETOConstant);
  }

  get ibtugNA() {
    if (!this.mw) return null;
    return mapCheck(this.mw, 100, 602, heatTableNAConstant);
  }

  get ibtugLII() {
    if (!this.mw) return null;
    return mapCheck(this.mw, 100, 606, heatTableLIIConstant);
  }
}
