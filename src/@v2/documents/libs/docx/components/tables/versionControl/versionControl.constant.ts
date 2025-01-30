import { headerTableProps } from './elements/header';

export enum VersionControlColumnEnum {
  INDEX,
  DATE,
  DESCRIPTION,
  REVISION_BY,
  APPROVE_BY,
  SIGNATURE,
}

const NewVersionControlHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[VersionControlColumnEnum.INDEX] = { text: 'N°', size: 1 };
  header[VersionControlColumnEnum.DATE] = { text: 'Data', size: 3 };
  header[VersionControlColumnEnum.DESCRIPTION] = {
    text: 'Histórico das Alterações',
    size: 15,
  };
  header[VersionControlColumnEnum.REVISION_BY] = {
    text: 'Revisado por:',
    size: 5,
  };
  header[VersionControlColumnEnum.APPROVE_BY] = {
    text: 'Aprovado por:',
    size: 6,
  };
  header[VersionControlColumnEnum.SIGNATURE] = {
    text: 'Assinaturas:',
    size: 5,
  };

  return header;
};

export const versionControlHeader = NewVersionControlHeader();
