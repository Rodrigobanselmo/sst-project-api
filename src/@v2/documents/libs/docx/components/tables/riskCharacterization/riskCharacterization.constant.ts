import { TextDirection } from 'docx';
import { borderStyleGlobal } from '../../../base/config/styles';
import { headerTableProps } from './elements/header';
import { palette } from '../../../constants/palette';

export enum RiskCharacterizationColumnEnum {
  AGENT,
  CAS,
  PROPAGATION,
  UNIT,
  NR15LT,
  ACGIH_TWA,
  ACGIH_STEL,
  IPVS,
  PV,
  PE,
  CARNOGENICITY_ACGIH,
  CARNOGENICITY_LINACH,
  BEI,
  SEVERITY,
  SYMPTOMS,
  EFFECT_BODY,
}

const NewRiskCharacterizationHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[RiskCharacterizationColumnEnum.AGENT] = {
    text: 'Agentes',
    size: 4,
    textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.CAS] = {
    text: 'N° CAS',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.PROPAGATION] = {
    text: 'Meio de Agentes No CAS Propagação',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.UNIT] = {
    text: 'Unidade',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.NR15LT] = {
    text: 'NR-15 LT (ppm)',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.ACGIH_TWA] = {
    text: 'ACGIH TWA',
    size: 3,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.ACGIH_STEL] = {
    text: 'ACGIH STEL',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.IPVS] = {
    text: 'IPVS/IDHL',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.PV] = {
    text: 'PV (mmHg)',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.PE] = {
    text: 'PE (°C)',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.CARNOGENICITY_ACGIH] = {
    text: 'Carcinogenicidade ACGIH',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.CARNOGENICITY_LINACH] = {
    text: 'Carcinogenicidade LINACH',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.BEI] = {
    text: 'BEI/Exame Complementar (ACGIH/NR07)',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.SEVERITY] = {
    text: 'Severidade',
    size: 1,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.SYMPTOMS] = {
    text: 'RISCOS',
    size: 4,
    textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[RiskCharacterizationColumnEnum.EFFECT_BODY] = {
    text: 'Efeitos Sinérgicos (Órgãos Alvo)',
    size: 4,
    textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
    borders: borderStyleGlobal(palette.common.white.string),
  };

  return header;
};

export const riskCharacterizationHeader = NewRiskCharacterizationHeader();
