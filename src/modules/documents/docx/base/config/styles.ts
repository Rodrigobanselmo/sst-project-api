import {
  BorderStyle,
  IBorderOptions,
  ISectionPropertiesOptions,
  ITableBordersOptions,
  PageOrientation,
} from 'docx';

export const sectionProperties: ISectionPropertiesOptions = {
  page: {
    margin: {
      bottom: 900,
      left: 567,
      right: 567,
      top: 567,
      footer: 300,
      header: 300,
    },
  },
};

export const sectionLandscapeProperties: ISectionPropertiesOptions = {
  page: {
    margin: {
      left: 500,
      right: 500,
      top: 500,
      bottom: 500,
      footer: 300,
      header: 300,
    },
    size: { orientation: PageOrientation.LANDSCAPE },
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

interface ISTableBordersOptions {
  readonly top?: Partial<IBorderOptions>;
  readonly bottom?: Partial<IBorderOptions>;
  readonly left?: Partial<IBorderOptions>;
  readonly right?: Partial<IBorderOptions>;
  readonly insideHorizontal?: Partial<IBorderOptions>;
  readonly insideVertical?: Partial<IBorderOptions>;
  readonly size?: number;
}

export const borderStyle = (
  color: string,
  options: ISTableBordersOptions = {
    bottom: {},
    left: {},
    right: {},
    top: {},
    insideHorizontal: {},
    insideVertical: {},
    size: 1,
  },
): ITableBordersOptions => ({
  top: {
    style: BorderStyle.SINGLE,
    size: options.size,
    color: color,
    ...options.top,
  },
  bottom: {
    style: BorderStyle.SINGLE,
    size: options.size,
    color: color,
    ...options.bottom,
  },
  left: {
    style: BorderStyle.SINGLE,
    size: options.size,
    color: color,
    ...options.left,
  },
  insideVertical: {
    style: BorderStyle.SINGLE,
    size: options.size,
    color: color,
    ...options.insideVertical,
  },
  insideHorizontal: {
    style: BorderStyle.SINGLE,
    size: options.size,
    color: color,
    ...options.insideHorizontal,
  },
  right: {
    style: BorderStyle.SINGLE,
    size: options.size,
    color: color,
    ...options.right,
  },
});
