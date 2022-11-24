import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';
export declare const SignaturesConverter: (signatureEntity: (ProfessionalEntity | UserEntity)[], workspace: WorkspaceEntity) => IDocVariables[];
