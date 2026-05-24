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
import { readFileSync } from 'fs';
import sizeOf from 'image-size';

import {
  convertToEmu,
  convertToParagraph,
  convertToParagraphBox,
  pageHeight,
  pageWidth,
  sectionCoverProperties,
} from '../../config/styles';
import { setNiceProportion } from '../../../helpers/set-nice-proportion';
import { CompanyDocumentsCoverVO } from '@/@v2/shared/domain/values-object/company/company-document-cover.vo';

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
  imgPath?: string | null;
  companyName: string;
  title?: string;
  coverProps?: CompanyDocumentsCoverVO | null;
}

const title = (props: IHeaderProps) =>
  new Paragraph({
    children: [
      new TextRun({
        text: props.title || 'Criar variavel local "TITULO_DO_DOCUMENTO"',
        size: (props?.coverProps?.titleProps?.size || 0) * 2 || 96,
        bold: props?.coverProps?.titleProps?.bold ?? true,
        ...(props?.coverProps?.titleProps?.color && {
          color: props?.coverProps?.titleProps?.color,
        } as any),
      } as any),
    ],
    spacing: { after: 400, before: 0 },
    ...(props?.coverProps?.titleProps && {
      frame: {
        type: 'absolute',
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
      } as any,
      spacing: { after: 0, before: 0 },
    } as any),
  });

const COVER_ESTABLISHMENT_PREFIX = 'Estabelecimento:';

const createCoverTextRun = (
  text: string,
  props: ITextProps | undefined,
  options: { bold?: boolean; break?: boolean },
) =>
  new TextRun({
    text,
    size: (props?.size || 0) * 2 || 40,
    bold: options.bold ?? props?.bold ?? false,
    ...(options.break && { break: 1 }),
    ...(props?.color && {
      color: props?.color,
    } as any),
  } as any);

const buildCoverTextRuns = (text: string, props?: ITextProps) => {
  const lines = text ? text.split('\n') : [''];

  return lines.map((line, index) =>
    createCoverTextRun(line, props, { break: index !== 0 }),
  );
};

const buildCoverCompanyTextRuns = (text: string, props?: ITextProps) => {
  const lines = text ? text.split('\n') : [''];
  const runs: TextRun[] = [];
  const isMultiline = lines.length > 1;

  lines.forEach((line, index) => {
    const isBreak = index !== 0;

    if (line.startsWith(COVER_ESTABLISHMENT_PREFIX)) {
      const rest = line.slice(COVER_ESTABLISHMENT_PREFIX.length);

      runs.push(
        createCoverTextRun(COVER_ESTABLISHMENT_PREFIX, props, {
          bold: true,
          break: isBreak,
        }),
      );

      if (rest) {
        runs.push(createCoverTextRun(rest, props, { bold: false }));
      }

      return;
    }

    runs.push(
      createCoverTextRun(line, props, {
        bold: isMultiline,
        break: isBreak,
      }),
    );
  });

  return runs;
};

const textShow = (text?: string, props?: ITextProps) =>
  new Paragraph({
    children: buildCoverTextRuns(text || '', props),
    spacing: { after: 100, before: 0 },
    ...(props && {
      frame: {
        type: 'absolute',
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
      } as any,
      spacing: { after: 0, before: 0 },
    } as any),
  });

const companyTextShow = (text?: string, props?: ITextProps) =>
  new Paragraph({
    children: buildCoverCompanyTextRuns(text || '', props),
    spacing: { after: 100, before: 0 },
    ...(props && {
      frame: {
        type: 'absolute',
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
      } as any,
      spacing: { after: 0, before: 0 },
    } as any),
  });

const imageCover = (props: IHeaderProps) => {
  return new Paragraph({
    children: [
      new ImageRun({
        data: readFileSync(props.coverProps!.backgroundImagePath!),
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
      } as any),
    ],
    alignment: AlignmentType.CENTER,
  });
};

const imageLogo = (props: IHeaderProps) => {
  const { height: imgHeight, width: imgWidth } = sizeOf(readFileSync(props.imgPath!));

  const logoProps = props?.coverProps?.logoProps;

  const { height, width } = setNiceProportion(
    logoProps?.maxLogoWidth || 630,
    logoProps?.maxLogoHeight || 354,
    imgWidth || 0,
    imgHeight || 0,
  );

  return new Paragraph({
    children: [
      new ImageRun({
        data: readFileSync(props.imgPath!),
        transformation: {
          width,
          height,
        },
        ...(logoProps && {
          floating: {
            zIndex: 1,
            horizontalPosition: {
              offset: convertToEmu(logoProps.x || 0, 'w'),
            },
            verticalPosition: {
              offset: convertToEmu((logoProps.y || 0) + ((logoProps?.maxLogoHeight ?? 0) - height) / 2, 'h'),
            },
            behindDocument: true,
          },
        } as any),
      } as any),
    ],
    alignment: AlignmentType.CENTER,
  });
};

export const createCover = (props: IHeaderProps): Paragraph[] => {
  const coverSection = [] as Paragraph[];

  if (props?.coverProps?.backgroundImagePath) coverSection.push(imageCover(props));

  coverSection.push(title(props));
  coverSection.push(textShow(props.version, props?.coverProps?.versionProps));
  coverSection.push(textShow(''));
  if (props.imgPath) coverSection.push(imageLogo(props));
  coverSection.push(textShow(''));
  coverSection.push(textShow(''));
  coverSection.push(companyTextShow(props.companyName, props?.coverProps?.companyProps));

  return coverSection;
};

export const coverSections = (props: IHeaderProps): ISectionOptions => {
  return {
    children: [...createCover(props)],
    properties: sectionCoverProperties,
  };
};
