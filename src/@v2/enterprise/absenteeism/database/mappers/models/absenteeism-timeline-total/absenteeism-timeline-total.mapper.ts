import { AbsenteeismTimelineTotalReadModel } from '@/@v2/enterprise/absenteeism/domain/models/read-absenteeism-timeline-total/read-absenteeism-timeline-total.model';
import { AbsenteeismTimelineTotalResultReadModelMapper, IAbsenteeismTimelineTotalResultReadModelMapper } from './absenteeism-timeline-total-result.mapper';

export type IAbsenteeismTimelineTotalReadModelMapper = {
  results: IAbsenteeismTimelineTotalResultReadModelMapper[];
  range: { startDate?: Date; endDate?: Date };
};

export class AbsenteeismTimelineTotalReadModelMapper {
  static toModel(prisma: IAbsenteeismTimelineTotalReadModelMapper): AbsenteeismTimelineTotalReadModel {
    return new AbsenteeismTimelineTotalReadModel({
      results: AbsenteeismTimelineTotalResultReadModelMapper.toModels(this.fillMissingMonths(prisma)),
    });
  }

  private static fillMissingMonths(data: IAbsenteeismTimelineTotalReadModelMapper) {
    const { results, range } = data;
    const { startDate: rangeStartStr, endDate: rangeEndStr } = range;

    // 1. Parse the start and end dates of the range
    const startDate = new Date(rangeStartStr);
    const endDate = new Date(rangeEndStr);

    // Normalize startDate to the first day of its month
    const currentMonthDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    // Normalize endDate to the first day of its month for comparison
    const lastMonthDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    // 2. Create a Map for quick lookup of existing results
    const resultsMap = new Map();
    results.forEach((item) => {
      resultsMap.set(item.absenteeism_year_month, item);
    });

    const filledResults = [];

    // 3. Iterate through each month in the range
    while (currentMonthDate <= lastMonthDate) {
      const year = currentMonthDate.getFullYear();
      const month = (currentMonthDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
      const yearMonthKey = `${year}-${month}`;

      if (resultsMap.has(yearMonthKey)) {
        filledResults.push(resultsMap.get(yearMonthKey));
      } else {
        filledResults.push({
          absenteeism_year_month: yearMonthKey,
          total_absenteeism_count: 0,
          total_absenteeism_minutes: 0,
        });
      }

      // Move to the next month
      currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
    }

    // 4. Sort the results (optional, but good practice if the input 'results' wasn't sorted
    // or if the filling process might alter order, though it shouldn't here)
    filledResults.sort((a, b) => {
      if (a.absenteeism_year_month < b.absenteeism_year_month) return -1;
      if (a.absenteeism_year_month > b.absenteeism_year_month) return 1;
      return 0;
    });

    return filledResults;
  }
}
