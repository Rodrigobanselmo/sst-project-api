import { VersionModel } from '@/@v2/documents/domain/models/version.model';
import { sortData } from '@/@v2/shared/utils/sorts/data.sort';
import dayjs from 'dayjs';
import { bodyTableProps } from './elements/body';
import { VersionControlColumnEnum } from './versionControl.constant';

export const versionControlConverter = (documentsVersions: VersionModel[]) => {
  const rows: bodyTableProps[][] = [];

  documentsVersions
    .sort((a, b) => sortData(a, b, 'createdAt'))
    .map((version, index) => {
      const cells: bodyTableProps[] = [];

      cells[VersionControlColumnEnum.INDEX] = { text: String(index + 1) };
      cells[VersionControlColumnEnum.DATE] = {
        text: dayjs(version.createdAt).format('DD/MM/YYYY') || '',
      };
      cells[VersionControlColumnEnum.DESCRIPTION] = {
        text: version.description || '',
      };
      cells[VersionControlColumnEnum.REVISION_BY] = {
        text: version.revisionBy || '',
      };
      cells[VersionControlColumnEnum.APPROVE_BY] = {
        text: version.approvedBy || '',
      };
      cells[VersionControlColumnEnum.SIGNATURE] = { text: '' };

      rows.push(cells);
    });

  return rows;
};
