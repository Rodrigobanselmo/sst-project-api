"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverSections = exports.createCover = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const image_size_1 = __importDefault(require("image-size"));
const setNiceProportion_1 = require("../../../../../../shared/utils/setNiceProportion");
const styles_1 = require("../../config/styles");
const title = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return new docx_1.Paragraph(Object.assign({ children: [
            new docx_1.TextRun(Object.assign({ text: props.title || 'PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR', size: (((_b = (_a = props === null || props === void 0 ? void 0 : props.coverProps) === null || _a === void 0 ? void 0 : _a.titleProps) === null || _b === void 0 ? void 0 : _b.size) || 0) * 2 || 96, bold: (_e = (_d = (_c = props === null || props === void 0 ? void 0 : props.coverProps) === null || _c === void 0 ? void 0 : _c.titleProps) === null || _d === void 0 ? void 0 : _d.bold) !== null && _e !== void 0 ? _e : true }, (((_g = (_f = props === null || props === void 0 ? void 0 : props.coverProps) === null || _f === void 0 ? void 0 : _f.titleProps) === null || _g === void 0 ? void 0 : _g.color) && {
                color: (_j = (_h = props === null || props === void 0 ? void 0 : props.coverProps) === null || _h === void 0 ? void 0 : _h.titleProps) === null || _j === void 0 ? void 0 : _j.color,
            }))),
        ], spacing: { after: 400, before: 0 } }, (((_k = props === null || props === void 0 ? void 0 : props.coverProps) === null || _k === void 0 ? void 0 : _k.titleProps) && {
        frame: {
            position: {
                x: (0, styles_1.convertToParagraph)(((_m = (_l = props === null || props === void 0 ? void 0 : props.coverProps) === null || _l === void 0 ? void 0 : _l.titleProps) === null || _m === void 0 ? void 0 : _m.x) || 0),
                y: (0, styles_1.convertToParagraph)(((_p = (_o = props === null || props === void 0 ? void 0 : props.coverProps) === null || _o === void 0 ? void 0 : _o.titleProps) === null || _p === void 0 ? void 0 : _p.y) || 0),
            },
            width: (0, styles_1.convertToParagraphBox)(((_r = (_q = props === null || props === void 0 ? void 0 : props.coverProps) === null || _q === void 0 ? void 0 : _q.titleProps) === null || _r === void 0 ? void 0 : _r.boxX) || 0),
            height: (0, styles_1.convertToParagraphBox)(((_t = (_s = props === null || props === void 0 ? void 0 : props.coverProps) === null || _s === void 0 ? void 0 : _s.titleProps) === null || _t === void 0 ? void 0 : _t.boxY) || 0),
            anchor: {
                horizontal: docx_1.FrameAnchorType.PAGE,
                vertical: docx_1.FrameAnchorType.PAGE,
            },
            alignment: {
                x: docx_1.HorizontalPositionAlign.LEFT,
                y: docx_1.VerticalPositionAlign.TOP,
            },
        },
        spacing: { after: 0, before: 0 },
    })));
};
const textShow = (text, props) => {
    var _a;
    return new docx_1.Paragraph(Object.assign({ children: [
            new docx_1.TextRun(Object.assign({ text: text || '', size: ((props === null || props === void 0 ? void 0 : props.size) || 0) * 2 || 40, bold: (_a = props === null || props === void 0 ? void 0 : props.bold) !== null && _a !== void 0 ? _a : false }, ((props === null || props === void 0 ? void 0 : props.color) && {
                color: props === null || props === void 0 ? void 0 : props.color,
            }))),
        ], spacing: { after: 100, before: 0 } }, (props && {
        frame: {
            position: {
                x: (0, styles_1.convertToParagraph)(props.x || 0),
                y: (0, styles_1.convertToParagraph)(props.y || 0),
            },
            width: (0, styles_1.convertToParagraphBox)(props.boxX || 0),
            height: (0, styles_1.convertToParagraphBox)(props.boxY || 0),
            anchor: {
                horizontal: docx_1.FrameAnchorType.PAGE,
                vertical: docx_1.FrameAnchorType.PAGE,
            },
            alignment: {
                x: docx_1.HorizontalPositionAlign.LEFT,
                y: docx_1.VerticalPositionAlign.TOP,
            },
        },
        spacing: { after: 0, before: 0 },
    })));
};
const imageCover = (props) => {
    return new docx_1.Paragraph({
        children: [
            new docx_1.ImageRun({
                data: fs_1.default.readFileSync(props.coverProps.backgroundImagePath),
                transformation: {
                    width: styles_1.pageWidth,
                    height: styles_1.pageHeight,
                },
                floating: {
                    zIndex: 0,
                    horizontalPosition: {
                        relative: docx_1.HorizontalPositionRelativeFrom.PAGE,
                        align: docx_1.HorizontalPositionAlign.CENTER,
                    },
                    verticalPosition: {
                        relative: docx_1.VerticalPositionRelativeFrom.PAGE,
                        align: docx_1.VerticalPositionAlign.CENTER,
                    },
                    behindDocument: true,
                },
            }),
        ],
        alignment: docx_1.AlignmentType.CENTER,
    });
};
const imageLogo = (props) => {
    var _a, _b;
    const { height: imgHeight, width: imgWidth } = (0, image_size_1.default)(fs_1.default.readFileSync(props.imgPath));
    const logoProps = (_a = props === null || props === void 0 ? void 0 : props.coverProps) === null || _a === void 0 ? void 0 : _a.logoProps;
    const { height, width } = (0, setNiceProportion_1.setNiceProportion)((logoProps === null || logoProps === void 0 ? void 0 : logoProps.maxLogoWidth) || 630, (logoProps === null || logoProps === void 0 ? void 0 : logoProps.maxLogoHeight) || 354, imgWidth, imgHeight);
    return new docx_1.Paragraph({
        children: [
            new docx_1.ImageRun(Object.assign({ data: fs_1.default.readFileSync(props.imgPath), transformation: {
                    width,
                    height,
                } }, (logoProps && {
                floating: {
                    zIndex: 1,
                    horizontalPosition: {
                        offset: (0, styles_1.convertToEmu)(logoProps.x, 'w'),
                    },
                    verticalPosition: {
                        offset: (0, styles_1.convertToEmu)(logoProps.y + (((_b = logoProps === null || logoProps === void 0 ? void 0 : logoProps.maxLogoHeight) !== null && _b !== void 0 ? _b : 0) - height) / 2, 'h'),
                    },
                    behindDocument: true,
                },
            }))),
        ],
        alignment: docx_1.AlignmentType.CENTER,
    });
};
const createCover = (props) => {
    var _a, _b, _c;
    const coverSection = [];
    if ((_a = props === null || props === void 0 ? void 0 : props.coverProps) === null || _a === void 0 ? void 0 : _a.backgroundImagePath)
        coverSection.push(imageCover(props));
    coverSection.push(title(props));
    coverSection.push(textShow(props.version, (_b = props === null || props === void 0 ? void 0 : props.coverProps) === null || _b === void 0 ? void 0 : _b.versionProps));
    coverSection.push(textShow(''));
    if (props.imgPath)
        coverSection.push(imageLogo(props));
    coverSection.push(textShow(''));
    coverSection.push(textShow(''));
    coverSection.push(textShow(props.companyName, (_c = props === null || props === void 0 ? void 0 : props.coverProps) === null || _c === void 0 ? void 0 : _c.companyProps));
    return coverSection;
};
exports.createCover = createCover;
const coverSections = (props) => {
    return {
        children: [...(0, exports.createCover)(props)],
        properties: styles_1.sectionCoverProperties,
    };
};
exports.coverSections = coverSections;
//# sourceMappingURL=cover.js.map