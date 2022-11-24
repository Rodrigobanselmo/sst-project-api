import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { Paragraph, Table } from 'docx';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';
import { ISectionChildrenType } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { UserEntity } from './../../../../../users/entities/user.entity';
export declare const signaturesIterable: (signatureEntity: (ProfessionalEntity | UserEntity)[], workspace: WorkspaceEntity, convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => Table[];
