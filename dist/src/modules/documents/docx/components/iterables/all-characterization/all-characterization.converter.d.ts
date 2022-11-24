import { Paragraph, Table } from 'docx';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { RiskFactorsEntity } from '../../../../../sst/entities/risk.entity';
import { CharacterizationPhotoEntity } from '../../../../../company/entities/characterization-photo.entity';
import { EnvironmentPhotoEntity } from '../../../../../company/entities/environment-photo.entity';
import { EnvironmentEntity } from '../../../../../company/entities/environment.entity';
import { CharacterizationTypeEnum } from '@prisma/client';
export interface IEnvironmentConvertResponse {
    variables: IDocVariables;
    elements: ReturnType<typeof getLayouts>;
    risks: RiskFactorsEntity[];
    considerations: string[];
    activities: string[];
    paragraphs: string[];
    breakPage: boolean;
    type: CharacterizationTypeEnum;
    id: string;
    profileParentId?: string;
    profileName?: string;
    profiles?: EnvironmentEntity[];
}
export declare const environmentsConverter: (environments: EnvironmentEntity[]) => IEnvironmentConvertResponse[];
export declare const getLayouts: (vPhotos: (EnvironmentPhotoEntity | CharacterizationPhotoEntity)[], hPhotos: (EnvironmentPhotoEntity | CharacterizationPhotoEntity)[]) => Paragraph[] | Table[];
