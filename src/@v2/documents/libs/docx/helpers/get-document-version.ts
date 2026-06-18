import { dateUtils } from "@/@v2/shared/utils/helpers/date-utils";
import { resolveDocumentEmissionDate } from "./document-emission-date.util";
import { formatRevisionDisplayLabel } from "./format-document-revision-display.util";

export type IGetDocumentVersion = {
  createdAt: Date;
  version: string;
  documentDate?: Date | null;
};

export const getDocumentVersion = ({
  createdAt,
  version,
  documentDate,
}: IGetDocumentVersion) => {
  const emissionDate = resolveDocumentEmissionDate({
    createdAt,
    documentDate,
  });

  if (!version) return `${dateUtils(emissionDate).format('DD/MM/YYYY')}`;
  return `${dateUtils(emissionDate).format('DD/MM/YYYY')} — ${formatRevisionDisplayLabel(version)}`;
};
