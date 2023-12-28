import { PageOrientation } from 'docx';
import { IExamOrigins } from './../../../../../../../sst/entities/exam.entity';
import { IHierarchyMap, IHomoGroupMap } from './../../../../../converter/hierarchy.converter';

import { examsByRiskByGroupTable } from './examsByRiskByGroup.table';

export const examsByRiskByGroupSection = (homoMap: IHomoGroupMap, exams: IExamOrigins[], hierarchyTree: IHierarchyMap) => {
    const table = examsByRiskByGroupTable(homoMap, exams, hierarchyTree);

    const section = {
        children: [table],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: PageOrientation.PORTRAIT },
            },
        },
    };

    return section;
};
