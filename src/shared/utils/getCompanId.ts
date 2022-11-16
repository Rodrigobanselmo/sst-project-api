const getBodyCompanyId = (company?: { companyId?: string } | { companyId?: string }[]) => {
  if (!company) return;

  if (!Array.isArray(company) && typeof company === 'object') {
    return company?.companyId ?? undefined;
  }

  if (Array.isArray(company)) {
    const companyId = company[0] && company[0]?.companyId;
    if (!companyId) return;

    const allSameCompany = company.every((item) => {
      return item?.companyId && item.companyId === companyId;
    });

    return allSameCompany ? companyId : false;
  }
};

export const getCompanyId = (req): string | false => {
  const query = req.query;
  const params = req.params;
  const body = req.body;

  if (params && params.companyId) return params.companyId;
  if (query && query.companyId) return query.companyId;

  if (body) {
    const bodySearch = getBodyCompanyId(body);

    if (bodySearch === false) return false;
    if (bodySearch) return bodySearch;
  }

  return;
};
