import * as fs from 'fs/promises';
import * as path from 'path';

// Define the type of your JSON data
interface AbsenceRecord {
  Matrícula: string;
  'Nome completo': string;
  'Denom.grp.empreg.': string;
  'Denominação de cargo': string;
  'Texto área rec.hum.': string;
  'Txt.tp.pres./ausên.': string;
  'Data início': string;
  'Data fim': string;
  'Dias de calendário': string;
}

interface AbsenceTypeMapping {
  [key: string]: number;
}

const absenceTypeMapper: AbsenceTypeMapping = {
  'Lic.Atest.Méd.até 10 dias': 2,
  'Lic.Atest.Méd.até 15 dias': 2,
  'Lic.maternid.-Adm. Direta': 9,
  'Licença Trat Saúde INSS': 0,
  'Licença Tratamento Saúde': 0,
  'Licença Tratamento': 0,
};

type AbsenceData = AbsenceRecord[];

function convertDDMMYYYYToDate(dateString: string): Date | null {
  // Regular expression to validate the format
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

  if (!dateRegex.test(dateString)) {
    console.error(`Invalid date format: ${dateString}. Expected DD/MM/YYYY.`);
    return null; // Or throw an error, depending on your needs
  }

  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript Date objects
  const year = parseInt(parts[2], 10);

  // Validate the date (check for impossible dates like Feb 30)
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error(`Invalid date values in: ${dateString}.`);
    return null;
  }

  const date = new Date(year, month, day);

  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    console.error(`The date ${dateString} is not a valid date.`);
    return null; // Handle invalid dates like February 30th.
  }

  return date;
}

// Function to read, modify, and save the JSON data
async function processJsonFile(inputFilePath: string, outputFilePath: string): Promise<void> {
  try {
    const rawData = await fs.readFile(inputFilePath, 'utf-8');
    const jsonData: AbsenceData = JSON.parse(rawData);

    const enhancedData = jsonData.map((record) => {
      const days = Number(String(record['Dias de calendário']).replace('.00', '').trim());

      // CONVERT FROM DD/MM/YYYY TO Date OBJECT

      let motive = absenceTypeMapper[record['Txt.tipo presença/ausên.']];
      if (motive === 0) {
        motive = days > 15 ? 15 : 2;
      }

      return {
        matricula: record['Matrícula'],
        nomeCompleto: record['Nome completo'],
        motivo: motive,
        dataInicio: convertDDMMYYYYToDate(record['Data início']),
        dataFim: convertDDMMYYYYToDate(record['Data fim']),
        dias: days,
      };
    });

    const updatedJsonString = JSON.stringify(enhancedData, null, 2); // null, 2 for pretty printing (optional)

    await fs.writeFile(outputFilePath, updatedJsonString, 'utf-8');

    console.log(`JSON data successfully processed and saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error processing JSON file:', error);
    if (error instanceof Error) {
      console.error(error.message); // More specific error message
    }
  }
}

async function main() {
  console.log('Processing JSON data...');
  const inputFilePath = path.join(__dirname, 'input.json'); // Replace with your input file path
  console.log('Input file path:', inputFilePath);
  const outputFilePath = path.join(__dirname, 'output.json'); // Replace with your desired output file path
  console.log('Output file path:', outputFilePath);

  await processJsonFile(inputFilePath, outputFilePath);
}

main();
