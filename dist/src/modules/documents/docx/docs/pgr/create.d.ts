import { ISectionOptions } from 'docx';
import { ICreatePGR } from './types/pgr.types';
export declare class CreatePgr {
    private version;
    private logo;
    private docSections;
    constructor({ version, logo }: ICreatePGR);
    create(): ISectionOptions[];
    private getVariables;
    private convertToSections;
}
