import {
  AlignmentType,
  FrameAnchorType,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  ISectionOptions,
  Paragraph,
  TextRun,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
} from 'docx';
import fs from 'fs';
import sizeOf from 'image-size';

import { setNiceProportion } from '../../../../../../shared/utils/setNiceProportion';
import {
  convertToEmu,
  convertToParagraph,
  convertToParagraphBox,
  pageHeight,
  pageWidth,
  sectionCoverProperties,
} from '../../config/styles';

interface ITextProps {
  x?: number;
  y?: number;
  boxX?: number;
  boxY?: number;
  size?: number;
  color?: string;
  bold?: boolean;
}
interface IHeaderProps {
  version: string;
  imgPath: string;
  companyName: string;
  title?: string;
  coverProps?: {
    logoProps?: {
      maxLogoHeight?: number;
      maxLogoWidth?: number;
      x?: number;
      y?: number;
    };
    titleProps?: ITextProps;
    versionProps?: ITextProps;
    companyProps?: ITextProps;
    backgroundImagePath?: string;
  };
}

const title = (props: IHeaderProps) =>
  new Paragraph({
    children: [
      new TextRun({
        text: props.title || 'PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR',
        size: (props?.coverProps?.titleProps?.size || 0) * 2 || 96,
        bold: props?.coverProps?.titleProps?.bold ?? true,
        ...(props?.coverProps?.titleProps?.color && {
          color: props?.coverProps?.titleProps?.color,
        }),
      }),
    ],
    spacing: { after: 400, before: 0 },
    ...(props?.coverProps?.titleProps && {
      frame: {
        position: {
          x: convertToParagraph(props?.coverProps?.titleProps?.x || 0),
          y: convertToParagraph(props?.coverProps?.titleProps?.y || 0),
        },
        width: convertToParagraphBox(props?.coverProps?.titleProps?.boxX || 0),
        height: convertToParagraphBox(props?.coverProps?.titleProps?.boxY || 0),
        anchor: {
          horizontal: FrameAnchorType.PAGE,
          vertical: FrameAnchorType.PAGE,
        },
        alignment: {
          x: HorizontalPositionAlign.LEFT,
          y: VerticalPositionAlign.TOP,
        },
      },
      spacing: { after: 0, before: 0 },
    }),
  });

const textShow = (text?: string, props?: ITextProps) =>
  new Paragraph({
    children: [
      new TextRun({
        text: text || '',
        size: (props?.size || 0) * 2 || 40,
        bold: props?.bold ?? false,
        ...(props?.color && {
          color: props?.color,
        }),
      }),
    ],
    spacing: { after: 100, before: 0 },
    ...(props && {
      frame: {
        position: {
          x: convertToParagraph(props.x || 0),
          y: convertToParagraph(props.y || 0),
        },
        width: convertToParagraphBox(props.boxX || 0),
        height: convertToParagraphBox(props.boxY || 0),
        anchor: {
          horizontal: FrameAnchorType.PAGE,
          vertical: FrameAnchorType.PAGE,
        },
        alignment: {
          x: HorizontalPositionAlign.LEFT,
          y: VerticalPositionAlign.TOP,
        },
      },
      spacing: { after: 0, before: 0 },
    }),
  });

const imageCover = (props: IHeaderProps) => {
  return new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(props.coverProps.backgroundImagePath),
        transformation: {
          width: pageWidth,
          height: pageHeight,
        },
        floating: {
          zIndex: 0,
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.PAGE,
            align: HorizontalPositionAlign.CENTER,
          },
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.PAGE,
            align: VerticalPositionAlign.CENTER,
          },
          behindDocument: true,
        },
      }),
    ],
    alignment: AlignmentType.CENTER,
  });
};

const imageLogo = (props: IHeaderProps) => {
  const { height: imgHeight, width: imgWidth } = sizeOf(
    fs.readFileSync(props.imgPath),
  );

  const logoProps = props?.coverProps?.logoProps;

  const { height, width } = setNiceProportion(
    logoProps?.maxLogoWidth || 630,
    logoProps?.maxLogoHeight || 354,
    imgWidth,
    imgHeight,
  );

  return new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(props.imgPath),
        transformation: {
          width,
          height,
        },
        ...(logoProps && {
          floating: {
            zIndex: 1,
            horizontalPosition: {
              offset: convertToEmu(logoProps.x, 'w'),
            },
            verticalPosition: {
              offset: convertToEmu(
                logoProps.y + ((logoProps?.maxLogoHeight ?? 0) - height) / 2,
                'h',
              ),
            },
            behindDocument: true,
          },
        }),
      }),
    ],
    alignment: AlignmentType.CENTER,
  });
};

export const createCover = (props: IHeaderProps): Paragraph[] => {
  const coverSection = [] as Paragraph[];

  if (props?.coverProps?.backgroundImagePath)
    coverSection.push(imageCover(props));

  coverSection.push(title(props));
  coverSection.push(textShow(props.version, props?.coverProps?.versionProps));
  coverSection.push(textShow(''));
  if (props.imgPath) coverSection.push(imageLogo(props));
  coverSection.push(textShow(''));
  coverSection.push(textShow(''));
  coverSection.push(
    textShow(props.companyName, props?.coverProps?.companyProps),
  );

  return coverSection;
};

export const coverSections = (props: IHeaderProps): ISectionOptions => {
  return {
    children: [...createCover(props)],
    properties: sectionCoverProperties,
  };
};
