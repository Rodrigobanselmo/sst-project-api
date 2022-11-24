import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';
import { ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { Paragraph, Table } from 'docx';
export declare const professionalsIterable: (professionalEntity: (ProfessionalEntity | UserEntity)[], workspace: WorkspaceEntity, convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => (Paragraph | Table)[];
