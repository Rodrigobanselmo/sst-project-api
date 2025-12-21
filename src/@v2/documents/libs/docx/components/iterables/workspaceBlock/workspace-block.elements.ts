import { WorkspaceModel } from '@/@v2/documents/domain/models/workspace.model';
import { formatCnpj } from '@/@v2/shared/utils/helpers/formats-cnpj';
import { formatCnae } from '@/@v2/shared/utils/helpers/formats-cnae';
import { Paragraph } from 'docx';
import { paragraphNewNormal } from '../../../base/elements/paragraphs';
import { h2 } from '../../../base/elements/heading';
import { htmlToDocx } from '../../../helpers/html-to-docx';

interface IWorkspaceBlockParams {
  workspace: WorkspaceModel;
}

export function workspaceBlockElements({ workspace }: IWorkspaceBlockParams): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (workspace.customSectionHTML) {
    paragraphs.push(...htmlToDocx(workspace.customSectionHTML));
    return paragraphs;
  }

  paragraphs.push(h2('Empresa Contratante'));

  if (workspace.razaoSocial) {
    paragraphs.push(paragraphNewNormal(`**Razão Social:** ${workspace.razaoSocial}`));
  }

  if (workspace.cnpj) {
    paragraphs.push(paragraphNewNormal(`**CNPJ:** ${formatCnpj(workspace.cnpj)}`));
  }

  if (workspace.address) {
    const addressParts: string[] = [];

    if (workspace.address.street) addressParts.push(workspace.address.street);
    if (workspace.address.number) addressParts.push(workspace.address.number);
    if (workspace.address.neighborhood) addressParts.push(workspace.address.neighborhood);
    if (workspace.address.city) addressParts.push(workspace.address.city);
    if (workspace.address.state) addressParts.push(workspace.address.state);
    if (workspace.address.cep) addressParts.push(`CEP: ${workspace.address.cep}`);

    if (addressParts.length > 0) {
      paragraphs.push(paragraphNewNormal(`**Endereço:** ${addressParts.join(' - ')}`));
    }
  }

  if (workspace.riskDegree) {
    paragraphs.push(paragraphNewNormal(`**Grau de Risco:** ${workspace.riskDegree}`));
  }

  if (workspace.cnaeCode) {
    const formattedCnaeCode = workspace.cnaeCode.includes('-') ? workspace.cnaeCode : formatCnae(workspace.cnaeCode);
    const formattedCnae = `${formattedCnaeCode} - ${workspace.cnaeLabel}`;
    paragraphs.push(paragraphNewNormal(`**CNAE:** ${formattedCnae}`));
  }

  if (workspace.workSchedule) {
    paragraphs.push(paragraphNewNormal(`**Jornada de Trabalho:** ${workspace.workSchedule}`));
  }

  return paragraphs;
}
