import { Test, TestingModule } from '@nestjs/testing';
import { ExcelProvider } from './ExcelProvider';

describe('DayJSProvider', () => {
  let excelProvider: ExcelProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelProvider],
    }).compile();

    excelProvider = module.get<ExcelProvider>(ExcelProvider);
  });

  it('should be defined', () => {
    expect(excelProvider).toBeDefined();
  });
});
