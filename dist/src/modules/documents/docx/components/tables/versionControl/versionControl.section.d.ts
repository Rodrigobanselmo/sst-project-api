import { PageOrientation } from 'docx';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
export declare const versionControlTableSection: (riskDocumentEntity: RiskDocumentEntity[]) => {
    children: import("docx").Table[];
    properties: {
        page: {
            margin: {
                left: number;
                right: number;
                top: number;
                bottom: number;
            };
            size: {
                orientation: PageOrientation;
            };
        };
    };
};
