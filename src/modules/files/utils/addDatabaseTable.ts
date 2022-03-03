export const addDatabaseTable = async (
  Workbook,
  companyId,
  DatabaseTable,
  databaseTableRepository,
  excelProvider,
  allSheets,
  system,
) => {
  const databaseTable = await databaseTableRepository.upsert(
    {
      name: Workbook.name,
      companyId,
      version: DatabaseTable.version ? Number(DatabaseTable.version) + 1 : 1,
    },
    companyId,
    system,
    DatabaseTable.id,
  );

  // create new table with new data
  const newExcelFile = await excelProvider.create({
    fileName: Workbook.name,
    version: databaseTable.version,
    lastUpdate: new Date(databaseTable.updated_at),
    sheets: allSheets,
  });

  return newExcelFile;
};
