import { AlignmentType, Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { environmentsConverter } from './all-characterization.converter';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { checkValidExistentRisk } from '@/@v2/shared/domain/functions/security/check-valid-existent-risk.func';

export const environmentIterable = (
  environments: HomogeneousGroupModel[],
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  if (!environments?.length) return [];

  const environmentData = environmentsConverter(environments);

  const getSentenceType = (sentence: string): ISectionChildrenType => {
    const splitSentence = sentence.split('{type}=');
    if (splitSentence.length == 2) {
      const value = splitSentence[1] as unknown as any;

      if (DocumentSectionChildrenTypeEnum.PARAGRAPH == value) {
        return {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: splitSentence[0],
        };
      }

      if (DocumentSectionChildrenTypeEnum.BULLET == value.split('-')[0]) {
        return {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: splitSentence[0],
          level: value.split('-')[1] || 0,
        };
      }
    }

    return {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
      text: splitSentence[0],
    };
  };

  const iterableSections = environmentData
    .map(({ variables, elements, risks, considerations: cons, breakPage }) => {
      const parameters: ISectionChildrenType[] = [];
      const riskFactors: ISectionChildrenType[] = [];
      const considerations: ISectionChildrenType[] = [];

      if (variables[VariablesPGREnum.ENVIRONMENT_NOISE]) {
        parameters.push({
          type: DocumentSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: `Ruído ambiente (Maior Valor Medido): ??${VariablesPGREnum.ENVIRONMENT_NOISE}?? dB(A)`,
        });
      }

      if (variables[VariablesPGREnum.ENVIRONMENT_TEMPERATURE]) {
        parameters.push({
          type: DocumentSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: `Temperatura do ar: ??${VariablesPGREnum.ENVIRONMENT_TEMPERATURE}?? ºC`,
        });
      }

      if (variables[VariablesPGREnum.ENVIRONMENT_MOISTURE]) {
        parameters.push({
          type: DocumentSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: `Umidade do ar: ??${VariablesPGREnum.ENVIRONMENT_MOISTURE}??%`,
        });
      }

      if (variables[VariablesPGREnum.ENVIRONMENT_LUMINOSITY]) {
        parameters.push({
          type: DocumentSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: `Umidade do ar: ??${VariablesPGREnum.ENVIRONMENT_LUMINOSITY}??%`,
        });
      }

      if (parameters.length) {
        parameters.unshift({
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Parâmetros ambientais:**',
        });

        // if (cons.length)
        //   parameters.push({
        //     type: PGRSectionChildrenTypeEnum.PARAGRAPH,
        //     text: '',
        //   });
      }

      risks
        .filter((risk) => checkValidExistentRisk(risk))
        .forEach((risk, index) => {
          if (index === 0)
            riskFactors.push({
              type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
              text: '**Fatores de risco:**',
            });

          riskFactors.push({
            type: DocumentSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `${risk.name} (${risk.type})`,
            alignment: AlignmentType.START,
          });

          if (index === risks.length - 1)
            riskFactors.push({
              type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
              text: '',
              removeWithSomeEmptyVars: [VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
            });
        });

      cons.forEach((consideration, index) => {
        if (index === 0)
          considerations.push({
            type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
            text: '**Considerações:**',
          });

        considerations.push({
          ...getSentenceType(consideration),
        });
      });

      const title = [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: `??${VariablesPGREnum.ENVIRONMENT_NAME}??`,
        },
      ] as ISectionChildrenType[];

      if (breakPage) title.unshift({ type: DocumentSectionChildrenTypeEnum.BREAK });

      return [
        ...convertToDocx([...title], variables),
        ...elements,
        ...convertToDocx(
          [
            ...riskFactors,
            {
              type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
              text: `??${VariablesPGREnum.ENVIRONMENT_DESCRIPTION}??`,
              alignment: AlignmentType.START,
              removeWithSomeEmptyVars: [VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
            },
            ...parameters,
            ...considerations,
          ],
          variables,
        ),
      ];
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
