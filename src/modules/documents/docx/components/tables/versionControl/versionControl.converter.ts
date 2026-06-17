/* eslint-disable prettier/prettier */
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { dayjs } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { sortData } from '../../../../../../shared/utils/sorts/data.sort';
import { bodyTableProps } from './elements/body';
import { resolveVersionControlField } from './version-control-field.util';
import { VersionControlFallback } from './version-control.types';
import {
  VERSION_CONTROL_COLUMN_WIDTHS,
  VersionControlColumnEnum,
} from './versionControl.constant';

export const versionControlConverter = (
  documentsVersions: RiskDocumentEntity[],
  fallback?: VersionControlFallback,
) => {
  const rows: bodyTableProps[][] = [];
  const sortedVersions = [...documentsVersions].sort((a, b) =>
    sortData(a, b, 'created_at'),
  );

  sortedVersions.forEach((version, index) => {
    const cells: bodyTableProps[] = [];

    cells[VersionControlColumnEnum.INDEX] = {
      text: String(index + 1),
      size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.INDEX],
    };
    cells[VersionControlColumnEnum.DATE] = {
      text: dayjs(version.created_at).format('DD/MM/YYYY') || '',
      size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.DATE],
    };
    cells[VersionControlColumnEnum.DESCRIPTION] = {
      text: version.description || '',
      size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.DESCRIPTION],
    };
    cells[VersionControlColumnEnum.REVISION_BY] = {
      text: resolveVersionControlField(
        version.revisionBy,
        version.version,
        index,
        sortedVersions.length,
        fallback?.revisionBy,
        fallback,
      ),
      size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.REVISION_BY],
    };
    cells[VersionControlColumnEnum.APPROVE_BY] = {
      text: resolveVersionControlField(
        version.approvedBy,
        version.version,
        index,
        sortedVersions.length,
        fallback?.approvedBy,
        fallback,
      ),
      size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.APPROVE_BY],
    };
    cells[VersionControlColumnEnum.SIGNATURE] = {
      text: '',
      size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.SIGNATURE],
    };

    rows.push(cells);
  });

  return rows;
};
