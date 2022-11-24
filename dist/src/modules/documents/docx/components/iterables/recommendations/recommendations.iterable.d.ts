import { Paragraph, Table } from 'docx';
import { ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { RiskFactorDataEntity } from '../../../../../sst/entities/riskData.entity';
export declare const recommendationsIterable: (riskData: Partial<RiskFactorDataEntity>[], convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => (Paragraph | Table)[];
