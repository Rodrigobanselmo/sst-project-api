import { IDocumentPGRSectionGroups } from '../types/section.types';
import { initSection } from './0-init';

export const docPGRSections: IDocumentPGRSectionGroups = {
  sections: [initSection],
  variables: [
    { placeholder: 'NOME_DO_CAPITULO_1', value: 'PARTE 01 – DOCUMENTO BASE' },
    { placeholder: 'NOME_DA_EMPRESA', value: 'TOXILAB' },
  ],
};
