import { TimeCountRangeEnum } from '../constants/time-count-range';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// O nome da função foi mantido, mas agora ela retorna o período atual E os anteriores.
// Um nome mais descritivo poderia ser "getCurrentAndPreviousDateRanges".
export function getPreviousDateRanges(timeRangeType: TimeCountRangeEnum, count: number, referenceDate: Date = new Date()): DateRange[] {
  const results: DateRange[] = [];

  // O cursor começa na data de referência e será movido para o passado a cada iteração.
  const cursorDate = new Date(referenceDate);

  // --- Função auxiliar para obter o final do dia ---
  const getEndOfDay = (date: Date): Date => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  for (let i = 0; i < count; i++) {
    let startDate: Date;
    let endDate: Date;

    if (timeRangeType === TimeCountRangeEnum.YEAR) {
      // 1. Pega o ano DIRETAMENTE do cursor (não o ano anterior).
      const targetYear = cursorDate.getFullYear();

      startDate = new Date(targetYear, 0, 1); // 1 de Janeiro
      endDate = getEndOfDay(new Date(targetYear, 11, 31)); // 31 de Dezembro

      // 2. MOVE o cursor para o ano anterior para a PRÓXIMA iteração.
      cursorDate.setFullYear(targetYear - 1);
    } else if (timeRangeType === TimeCountRangeEnum.SEMESTER) {
      // 1. Determina o semestre ATUAL do cursor.
      const cursorMonth = cursorDate.getMonth(); // 0-11
      const cursorYear = cursorDate.getFullYear();

      // Verifica se o cursor está no primeiro semestre (Jan-Jun)
      const isFirstSemester = cursorMonth < 6;

      if (isFirstSemester) {
        // O período atual é Jan-Jun do ano do cursor.
        startDate = new Date(cursorYear, 0, 1); // 1 de Janeiro
        endDate = getEndOfDay(new Date(cursorYear, 5, 30)); // 30 de Junho
      } else {
        // O período atual é Jul-Dez do ano do cursor.
        startDate = new Date(cursorYear, 6, 1); // 1 de Julho
        endDate = getEndOfDay(new Date(cursorYear, 11, 31)); // 31 de Dezembro
      }

      // 2. MOVE o cursor 6 meses para trás para a PRÓXIMA iteração.
      // Isso o colocará no semestre anterior para o próximo cálculo do loop.
      cursorDate.setMonth(cursorDate.getMonth() - 6);
    } else {
      // Lida com valores de enum inválidos.
      throw new Error(`Invalid timeRangeType: ${timeRangeType}`);
    }

    results.push({ startDate, endDate });
  }

  return results;
}
