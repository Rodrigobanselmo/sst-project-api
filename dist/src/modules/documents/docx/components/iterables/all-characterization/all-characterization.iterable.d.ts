import { Paragraph, Table } from 'docx';
import { ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { EnvironmentEntity } from '../../../../../company/entities/environment.entity';
export declare const environmentIterable: (environments: EnvironmentEntity[], convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => (Paragraph | Table)[];
