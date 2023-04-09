import { Borders } from 'exceljs';

export const allBorders: Partial<Borders> = {
  bottom: { style: 'thin', color: { argb: 'b5b5b5' } },
  left: { style: 'thin', color: { argb: 'b5b5b5' } },
  right: { style: 'thin', color: { argb: 'b5b5b5' } },
  top: { style: 'thin', color: { argb: 'b5b5b5' } },
};
export const requiredBorders: Partial<Borders> = {
  bottom: { style: 'thin', color: { argb: 'ff0000' } },
};

export const getBoxBorders = (rowIndex: number, columnIndex: number, rowLastIndex: number, columnLastIndex: number): Partial<Borders> => {
  const bottoms: Partial<Borders> = {};

  if (rowIndex === 0) {
    bottoms.top = { style: 'thin', color: { argb: 'b5b5b5' } };
  }

  if (rowIndex === rowLastIndex) {
    bottoms.bottom = { style: 'thin', color: { argb: 'b5b5b5' } };
  }

  if (columnIndex === 0) {
    bottoms.left = { style: 'thin', color: { argb: 'b5b5b5' } };
  }

  if (columnIndex === columnLastIndex) {
    bottoms.right = { style: 'thin', color: { argb: 'b5b5b5' } };
  }

  return bottoms;
};
