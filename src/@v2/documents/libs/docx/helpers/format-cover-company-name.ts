type CoverCompanyInput = {
  name: string;
  initials?: string | null;
};

type CoverWorkspaceInput = {
  isOwner: boolean;
  name: string;
  abbreviation?: string | null;
  razaoSocial?: string | null;
  companyJsonName?: string | null;
};

const formatEstablishmentLine = (workspace: CoverWorkspaceInput): string => {
  const razaoSocialEstabelecimento =
    workspace.razaoSocial?.trim() || workspace.companyJsonName?.trim() || '';
  const nomeEstabelecimento =
    workspace.name?.trim() || workspace.abbreviation?.trim() || '';

  if (razaoSocialEstabelecimento && nomeEstabelecimento) {
    return `Estabelecimento: ${razaoSocialEstabelecimento} — ${nomeEstabelecimento}`;
  }

  if (razaoSocialEstabelecimento) {
    return `Estabelecimento: ${razaoSocialEstabelecimento}`;
  }

  if (nomeEstabelecimento) {
    return `Estabelecimento: ${nomeEstabelecimento}`;
  }

  return '';
};

export const formatCoverCompanyName = (
  company: CoverCompanyInput,
  workspace?: CoverWorkspaceInput | null,
): string => {
  const hasEstablishment = Boolean(workspace && !workspace.isOwner);

  if (!hasEstablishment) {
    return `${company.name}${company.initials ? ` (${company.initials})` : ''}`;
  }

  const lines = [company.name.trim()];
  const establishmentLine = formatEstablishmentLine(workspace!);

  if (establishmentLine) {
    lines.push(establishmentLine);
  }

  return lines.join('\n');
};
