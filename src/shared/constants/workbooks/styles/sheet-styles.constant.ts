import ExcelJS from 'exceljs';

const colors = {
  optional: '4fb364',
  required: 'd9d239',
  addMore: '2333ff',
};

export const sheetStylesConstant = {
  fill: {
    optional: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colors.optional },
    },
    required: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colors.required },
    },
  } as Record<string, ExcelJS.Fill>,
  border: {
    addMore: {
      bottom: { style: 'medium', color: { argb: '2333ff' } },
    },
  } as Record<string, Partial<ExcelJS.Borders>>,
};
