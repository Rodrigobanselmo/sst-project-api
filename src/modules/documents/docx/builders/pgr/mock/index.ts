import { VariablesPGREnum } from '../enums/variables.enum';
import { IDocumentPGRSectionGroups } from '../types/section.types';
// import { testSection } from './0.0-test';
import { initSection } from './1.0-init';
import { definitionsSection } from './1.1-definitions';
import { definitions2Section } from './1.2-definitions';
import { complementsSection } from './1.3-complements';
import { mvvSection } from './1.4-mvv';
import { organizationSection } from './1.5-organization';
import { methodSection } from './1.5.2-method';
import { developmentSection } from './1.6-development';
import { qualityEvaluation } from './1.7-qualityEvaluation';
import { prioritization } from './1.8-prioritization';
import { investigation } from './1.9-investigation';
import { rs } from './1.9.1-rs';
import { document } from './1.9.2-document';
import { available } from './1.9.3-avaliation';
import { environmentSection } from './2.0-envronment';
import { employeeSection } from './2.1-employee';
import { characterizationSection } from './2.1.1-characterization';
import { riskFactorsSection } from './2.2-riskFactors';
import { riskFactors2Section } from './2.3-riskFactors';
import { riskFactors3Section } from './2.4-riskFactors';
import { gseSection } from './2.5-gse';
import { gse2Section } from './2.5.1-gse';
import { qualitySection } from './2.6-quality';
import { quantitySection } from './2.6.1-quantity';
import { quantityNoiseSection } from './2.6.2-quantity-noise';
import { quantityHeatSection } from './2.6.3-quantity-heat';
import { quantityVFBSection } from './2.6.4-quantity-vfb';
import { quantityVLSection } from './2.6.5-quantity-vl';
import { quantityRadSection } from './2.6.6-quantity-rad';
import { quantityQuiSection } from './2.6.7-quantity-qui';
import { prioritizationSection } from './2.7-prioritization';
import { prioritization2Section } from './2.7.1-prioritization';
import { recommendationsSection } from './2.8-recommendations';
import { recommendations1Section } from './2.8.1-recommendations';
import { endSection } from './2.9-end';
// import { attachmentsSection } from './3.0-anexos';
import { attachmentsLinkSection } from './3.01-anexos-link';

export const docPGRSections: IDocumentPGRSectionGroups = {
  sections: [
    // // // // testSection,
    initSection,
    definitionsSection,
    definitions2Section,
    complementsSection,
    mvvSection,
    organizationSection,
    methodSection,
    developmentSection,
    qualityEvaluation,
    prioritization,
    investigation,
    rs,
    document,
    available,
    environmentSection,
    employeeSection,
    characterizationSection,
    riskFactorsSection,
    riskFactors2Section,
    riskFactors3Section,
    gseSection,
    gse2Section,
    qualitySection,
    quantitySection,
    quantityNoiseSection,
    quantityHeatSection,
    quantityVFBSection,
    quantityVLSection,
    quantityRadSection,
    quantityQuiSection,
    prioritizationSection,
    prioritization2Section,
    recommendationsSection,
    recommendations1Section,
    endSection,
    attachmentsLinkSection,
    // // // // attachmentsSection,
  ],
  variables: {
    [VariablesPGREnum.CHAPTER_1]: 'PARTE 01 – DOCUMENTO BASE',
    [VariablesPGREnum.CHAPTER_2]: 'PARTE 02 – ANÁLISE PRELIMINAR E INDENTIFICAÇÃO DE PERIGOS',
    [VariablesPGREnum.CHAPTER_3]: 'PARTE 03 – AVALIAÇÃO DOS RISCOS OCUPACIONAIS',
    [VariablesPGREnum.CHAPTER_4]: 'PARTE 02 – DESENVOLVIMENTO',
  },
};
