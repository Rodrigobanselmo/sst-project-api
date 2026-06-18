import { VersionModel } from '@/@v2/documents/domain/models/version.model';
import { sortData } from '@/@v2/shared/utils/sorts/data.sort';
import dayjs from 'dayjs';
import { resolveDocumentEmissionDate } from '../../../helpers/document-emission-date.util';
import { bodyTableProps } from './elements/body';
import { resolveVersionControlField } from './version-control-field.util';
import { VersionControlFallback } from './version-control.types';
import {
  VERSION_CONTROL_COLUMN_WIDTHS,
  VersionControlColumnEnum,
} from './versionControl.constant';

export const versionControlConverter = (
  documentsVersions: VersionModel[],
  fallback?: VersionControlFallback,
) => {
  const rows: bodyTableProps[][] = [];
  const sortedVersions = [...documentsVersions].sort((a, b) =>
    sortData(a, b, 'createdAt'),
  );

  sortedVersions.forEach((version, index) => {
    const cells: bodyTableProps[] = [];

    cells[VersionControlColumnEnum.INDEX] = {
      text: String(index + 1),
      size: VERSION_CONTROL_COLUMN_WIDTHS[VersionControlColumnEnum.INDEX],
    };
    cells[VersionControlColumnEnum.DATE] = {
      text:
        dayjs(
          resolveDocumentEmissionDate({
            createdAt: version.createdAt,
            documentDate: version.documentDate,
          }),
        ).format('DD/MM/YYYY') || '',
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
