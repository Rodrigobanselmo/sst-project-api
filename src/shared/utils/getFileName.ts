export const getDocxFileName = ({
  name,
  typeName = '',
  companyName,
  version,
}: {
  name: string;
  typeName: string;
  companyName: string;
  version: string;
}) => {
  const docName = name.replace(/\s+/g, '');
  const fileAprName = `${
    docName.length > 0 ? docName + '-' : ''
  }${companyName}${typeName}-v${version}.docx`
    .normalize('NFD')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');

  return fileAprName;
};
