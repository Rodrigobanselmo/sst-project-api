import { dateUtils } from "@/@v2/shared/utils/helpers/date-utils";

export type IGetDocumentVersion = { createdAt: Date; version: string; }

export const getDocumentVersion = ({ createdAt, version }: IGetDocumentVersion) => {
  if (!createdAt || !version) return `${dateUtils().format('DD/MM/YYYY')}`;
  return `${dateUtils(createdAt).format('DD/MM/YYYY')} — REV. ${version}`;
};
