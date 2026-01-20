import { formatCnpj } from '@/@v2/shared/utils/helpers/formats-cnpj';
import { Paragraph } from 'docx';
import { paragraphNewNormal } from '../../../base/elements/paragraphs';
import { h2 } from '../../../base/elements/heading';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { hierarchyMap } from '../../../translations/hierarchy';
import { homogeneousGroupMap } from '../../../translations/groups';

interface IScopeBlockParams {
  data: DocumentPGRModel;
}

const homoTypeLabels: Record<HomoTypeEnum, string> = {
  [HomoTypeEnum.HIERARCHY]: homogeneousGroupMap[HomoTypeEnum.HIERARCHY].text,
  [HomoTypeEnum.ENVIRONMENT]: homogeneousGroupMap[HomoTypeEnum.ENVIRONMENT].text,
  [HomoTypeEnum.WORKSTATION]: homogeneousGroupMap[HomoTypeEnum.WORKSTATION].text,
  [HomoTypeEnum.EQUIPMENT]: homogeneousGroupMap[HomoTypeEnum.EQUIPMENT].text,
  [HomoTypeEnum.ACTIVITIES]: homogeneousGroupMap[HomoTypeEnum.ACTIVITIES].text,
};

const hierarchyTypeLabels: Record<HierarchyTypeEnum, string> = {
  [HierarchyTypeEnum.DIRECTORY]: hierarchyMap[HierarchyTypeEnum.DIRECTORY].text,
  [HierarchyTypeEnum.MANAGEMENT]: hierarchyMap[HierarchyTypeEnum.MANAGEMENT].text,
  [HierarchyTypeEnum.SECTOR]: hierarchyMap[HierarchyTypeEnum.SECTOR].text,
  [HierarchyTypeEnum.SUB_SECTOR]: hierarchyMap[HierarchyTypeEnum.SUB_SECTOR].text,
  [HierarchyTypeEnum.OFFICE]: hierarchyMap[HierarchyTypeEnum.OFFICE].text,
  [HierarchyTypeEnum.SUB_OFFICE]: hierarchyMap[HierarchyTypeEnum.SUB_OFFICE].text,
};

export function scopeBlockElements({ data }: IScopeBlockParams): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const workspace = data.documentBase.workspace;
  const company = data.documentBase.company;

  paragraphs.push(h2('Abrangência'));

  paragraphs.push(paragraphNewNormal('A critério da organização, o PGR pode ser implementado por unidade operacional, setor ou atividade. **(NR-01 Item 1.5.3.1.1.1)**'));

  // const cnpj = workspace.isOwner ? company.cnpj : workspace.cnpj;
  const cnpj = company.cnpj;

  // Check if there are selected group IDs for scope filtering
  if (data.scopeOfSelectedGroupIds && data.scopeOfSelectedGroupIds.length > 0) {
    // Get the selected homogeneous groups
    const selectedGroups = data.homogeneousGroups.filter((group) => data.scopeOfSelectedGroupIds.includes(group.id));

    if (selectedGroups.length > 0) {
      // Separate hierarchy groups from other groups
      const hierarchyGroups = selectedGroups.filter((group) => group.type === HomoTypeEnum.HIERARCHY);
      const otherGroups = selectedGroups.filter((group) => group.type !== HomoTypeEnum.HIERARCHY);

      // For hierarchy groups, get the actual hierarchy info
      const hierarchiesByType: Record<HierarchyTypeEnum, string[]> = {} as Record<HierarchyTypeEnum, string[]>;

      hierarchyGroups.forEach((group) => {
        // Get hierarchies linked to this group
        group.hierarchies.forEach((hg) => {
          const hierarchy = data.hierarchiesMap[hg.hierarchyId];
          if (hierarchy) {
            if (!hierarchiesByType[hierarchy.type]) hierarchiesByType[hierarchy.type] = [];
            if (!hierarchiesByType[hierarchy.type].includes(hierarchy.name)) {
              hierarchiesByType[hierarchy.type].push(hierarchy.name);
            }
          }
        });
      });

      // Group other types by HomoTypeEnum
      const groupsByType = otherGroups.reduce(
        (acc, group) => {
          const type = group.type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(group.name);
          return acc;
        },
        {} as Record<HomoTypeEnum, string[]>,
      );

      // Build the scope text parts
      const scopeParts: string[] = [];

      // Add hierarchy groups by hierarchy type
      Object.entries(hierarchiesByType).forEach(([type, names]) => {
        const label = hierarchyTypeLabels[type as HierarchyTypeEnum] || type;
        scopeParts.push(`**${label}:** ${names.join(', ')}`);
      });

      // Add other groups by homo type
      Object.entries(groupsByType).forEach(([type, names]) => {
        const label = homoTypeLabels[type as HomoTypeEnum] || type;
        scopeParts.push(`**${label}:** ${names.join(', ')}`);
      });

      paragraphs.push(paragraphNewNormal(`Este PGR compreende o Estabelecimento inscrito no CNPJ: **${formatCnpj(cnpj)}**, sendo aplicável aos seguintes grupos:`));

      scopeParts.forEach((part) => {
        paragraphs.push(paragraphNewNormal(part));
      });
    }
  } else {
    paragraphs.push(paragraphNewNormal(`Este PGR compreende todo Estabelecimento inscrito no CNPJ: **${formatCnpj(cnpj)}**.`));
  }

  return paragraphs;
}
