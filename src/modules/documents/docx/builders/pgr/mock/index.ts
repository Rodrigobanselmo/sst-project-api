import { VariablesPGREnum } from '../enums/variables.enum';
import { IDocumentPGRSectionGroups } from '../types/section.types';
// import { testSection } from './0.0-test';
import { initSection } from './1.0-init';
import { definitionsSection } from './1.1-definitions';
import { definitions2Section } from './1.2-definitions';
import { complementsSection } from './1.3-complements';
import { mvvSection } from './1.4-MVV';
import { organizationSection } from './1.5-organization';
import { organization2Section } from './1.5-organization2';
import { developmentSection } from './1.6-development';
import { qualityEvaluation } from './1.7-qualityEvaluation';
import { prioritization } from './1.8-prioritization';
import { investigation } from './1.9-investigation';
import { rs } from './1.9.1-rs';
import { document } from './1.9.2-document';
import { available } from './1.9.3-avaliation';
import { environmentSection } from './2.0-envronment';

export const docPGRSections: IDocumentPGRSectionGroups = {
  sections: [
    // testSection,
    initSection,
    definitionsSection,
    definitions2Section,
    developmentSection,
    complementsSection,
    mvvSection,
    organizationSection,
    organization2Section,
    qualityEvaluation,
    prioritization,
    investigation,
    rs,
    document,
    available,
    environmentSection,
  ],
  variables: {
    [VariablesPGREnum.CHAPTER_1]: 'PARTE 01 – DOCUMENTO BASE',
    [VariablesPGREnum.CHAPTER_2]: 'PARTE 02 – DESENVOLVIMENTO',
  },
};
