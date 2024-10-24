export type IGetDocxFileName = {
  name: string;
  typeName: string;
  companyName: string;
  version: string;
  date: string;
};

export const getDocumentFileName = ({
  name,
  typeName = '',
  companyName,
  version,
  date,
}: {
  name: string;
  typeName: string;
  companyName: string;
  version: string;
  date: string;
}) => {
  const docName = name.replace(/\s+/g, '');
  const fileAprName =
    `${docName.length > 0 ? docName + '-' : ''}${typeName}-${companyName.slice(0, 15)}-${date}-Rev${version}.docx`
      .normalize('NFD')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');

  return fileAprName;
};

export const getNormalizeFileName = ({ name }: { name: string }) => {
  const fileName = name
    .normalize('NFD')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');

  return fileName;
};
