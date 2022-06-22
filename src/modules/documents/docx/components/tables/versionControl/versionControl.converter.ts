/* eslint-disable prettier/prettier */
import { RiskDocumentEntity } from '../../../../../checklist/entities/riskDocument.entity';
import { dayjs } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { sortData } from '../../../../../../shared/utils/sorts/data.sort';
import { bodyTableProps } from './elements/body';
import { VersionControlColumnEnum } from './versionControl.constant';

export const versionControlConverter = (documentsVersions:  RiskDocumentEntity[]) => {
    const rows: bodyTableProps[][] = [];

  documentsVersions.sort((a, b) => sortData(a, b, 'created_at')).map((version,index) => {
    const cells: bodyTableProps[] = [];


    cells[VersionControlColumnEnum.INDEX] = { text: String(index) }
    cells[VersionControlColumnEnum.DATE] = { text: dayjs(version.created_at).format('DD/MM/YYYY') || '' }
    cells[VersionControlColumnEnum.DESCRIPTION] = { text: version.description || ''  }
    cells[VersionControlColumnEnum.REVISION_BY] = { text: version.revisionBy || '' }
    cells[VersionControlColumnEnum.APPROVE_BY] = { text: version.approvedBy || '' }
    cells[VersionControlColumnEnum.SIGNATURE] = { text: '' }
    
    rows.push(cells) 
  });

  return rows;
};
