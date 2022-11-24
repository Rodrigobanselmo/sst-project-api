"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseDocument = void 0;
const docx_1 = require("docx");
const createBaseDocument = (sections) => {
    const doc = new docx_1.Document({
        numbering: {
            config: [
                {
                    reference: 'heading-numbering',
                    levels: [
                        {
                            level: 0,
                            text: '%1.',
                            format: docx_1.LevelFormat.DECIMAL,
                        },
                        {
                            level: 1,
                            text: '%1.%2.',
                            format: docx_1.LevelFormat.DECIMAL,
                        },
                        {
                            level: 2,
                            text: '%1.%2.%3.',
                            format: docx_1.LevelFormat.DECIMAL,
                        },
                        {
                            level: 3,
                            text: '%1.%2.%3.%4.',
                            format: docx_1.LevelFormat.DECIMAL,
                        },
                        {
                            level: 4,
                            text: '%1.%2.%3.%4.%5.',
                            format: docx_1.LevelFormat.DECIMAL,
                        },
                        {
                            level: 5,
                            text: '%1.%2.%3.%4.%5.%6.',
                            format: docx_1.LevelFormat.DECIMAL,
                        },
                    ],
                },
                {
                    reference: 'table-numbering',
                    levels: [
                        {
                            level: 0,
                            text: 'Tabela: %1',
                            format: docx_1.LevelFormat.DECIMAL,
                        },
                    ],
                },
            ],
        },
        features: {
            updateFields: true,
        },
        styles: {
            default: {
                title: {
                    run: {
                        bold: true,
                        color: '000000',
                        size: 32,
                    },
                },
                heading1: {
                    run: {
                        color: '000000',
                        bold: true,
                        size: 28,
                    },
                    paragraph: {
                        numbering: {
                            reference: 'heading-numbering',
                            level: 0,
                        },
                        spacing: {
                            before: 320,
                            after: 160,
                        },
                    },
                },
                heading2: {
                    run: {
                        color: '000000',
                        bold: true,
                        size: 26,
                    },
                    paragraph: {
                        numbering: {
                            reference: 'heading-numbering',
                            level: 1,
                        },
                        spacing: {
                            before: 320,
                            after: 160,
                        },
                    },
                },
                heading3: {
                    run: {
                        color: '000000',
                        bold: true,
                        size: 24,
                    },
                    paragraph: {
                        numbering: {
                            reference: 'heading-numbering',
                            level: 2,
                        },
                        spacing: {
                            before: 320,
                            after: 160,
                        },
                    },
                },
                heading4: {
                    run: {
                        color: '000000',
                        bold: true,
                        size: 22,
                    },
                    paragraph: {
                        numbering: {
                            reference: 'heading-numbering',
                            level: 3,
                        },
                        spacing: {
                            before: 320,
                            after: 160,
                        },
                    },
                },
                heading5: {
                    run: {
                        color: '000000',
                        bold: true,
                        size: 20,
                    },
                    paragraph: {
                        numbering: {
                            reference: 'heading-numbering',
                            level: 4,
                        },
                        spacing: {
                            before: 320,
                            after: 160,
                        },
                    },
                },
                heading6: {
                    run: {
                        color: '000000',
                        bold: true,
                        size: 20,
                    },
                    paragraph: {
                        numbering: {
                            reference: 'heading-numbering',
                            level: 5,
                        },
                        spacing: {
                            before: 320,
                            after: 160,
                        },
                    },
                },
                document: {
                    run: {
                        font: 'Century Gothic',
                        size: 20,
                    },
                    paragraph: {
                        spacing: {
                            before: 0,
                            after: 160,
                        },
                    },
                },
            },
            paragraphStyles: [],
        },
        sections: sections,
    });
    return doc;
};
exports.createBaseDocument = createBaseDocument;
//# sourceMappingURL=document.js.map