/* eslint-disable prettier/prettier */
import { headerTableProps } from './elements/header';

export enum VersionControlColumnEnum {
  INDEX,
  DATE,
  DESCRIPTION,
  REVISION_BY,
  APPROVE_BY,
  SIGNATURE,
}

export const VERSION_CONTROL_COLUMN_WIDTHS: Record<VersionControlColumnEnum, number> = {
  [VersionControlColumnEnum.INDEX]: 5,
  [VersionControlColumnEnum.DATE]: 10,
  [VersionControlColumnEnum.DESCRIPTION]: 45,
  [VersionControlColumnEnum.REVISION_BY]: 15,
  [VersionControlColumnEnum.APPROVE_BY]: 15,
  [VersionControlColumnEnum.SIGNATURE]: 10,
};

const NewVersionControlHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[VersionControlColumnEnum.INDEX] = {
    text: 'N°',
    size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.INDEX],
  };
  header[VersionControlColumnEnum.DATE] = {
    text: 'Data',
    size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.DATE],
  };
  header[VersionControlColumnEnum.DESCRIPTION] = {
    text: 'Histórico das Alterações',
    size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.DESCRIPTION],
  };
  header[VersionControlColumnEnum.REVISION_BY] = {
    text: 'Revisado por:',
    size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.REVISION_BY],
  };
  header[VersionControlColumnEnum.APPROVE_BY] = {
    text: 'Aprovado por:',
    size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.APPROVE_BY],
  };
  header[VersionControlColumnEnum.SIGNATURE] = {
    text: 'Assinaturas:',
    size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.SIGNATURE],
  };

  return header;
};

export const versionControlHeader = NewVersionControlHeader();
