import { dateUtils } from "@/@v2/shared/utils/helpers/date-utils";

export type IGetDocumentVersion = { createdAt: Date; version: string; }

export const getDocumentVersion = ({ createdAt, version }: IGetDocumentVersion) => {
  if (!createdAt || !version) return `${dateUtils().format('MM_DD_YYYY')}`;
  return `${dateUtils(createdAt).format('MM_DD_YYYY')} - REV. ${version}`;
};
