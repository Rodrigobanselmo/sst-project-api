import {
  BorderStyle,
  ISectionPropertiesOptions,
  ITableBordersOptions,
} from 'docx';

export const sectionProperties: ISectionPropertiesOptions = {
  page: {
    margin: {
      bottom: 567,
      left: 567,
      right: 567,
      top: 567,
      footer: 100,
      header: 100,
    },
  },
};

export const sectionCoverProperties: ISectionPropertiesOptions = {
  page: {
    margin: {
      bottom: 1133,
      left: 1133,
      right: 1133,
      top: 1133,
      footer: 100,
      header: 100,
    },
  },
};

export const borderNoneStyle: ITableBordersOptions = {
  top: { style: BorderStyle.NIL, size: 0 },
  bottom: { style: BorderStyle.NIL, size: 0 },
  left: { style: BorderStyle.NIL, size: 0 },
  insideVertical: { style: BorderStyle.NIL, size: 0 },
  insideHorizontal: { style: BorderStyle.NIL, size: 0 },
  right: { style: BorderStyle.NIL, size: 0 },
};
