import { getPfxData } from '../../src/shared/utils/getPfxData';

import { readFileSync, writeFileSync } from 'fs';
import {
    PDFArray,
    PDFDocument,
    PDFHexString,
    PDFName,
    PDFNumber,
    PDFString,
    StandardFonts,
    degrees,
    drawImage,
    drawRectangle,
    drawText,
    rgb
} from 'pdf-lib';
import { SignPdf, DEFAULT_BYTE_RANGE_PLACEHOLDER } from 'node-signpdf';

import { Buffer } from 'buffer';
import { plainAddPlaceholder } from 'node-signpdf/dist/helpers/index.js';
import { BadRequestException } from '@nestjs/common';
import { DayJSProvider } from 'src/shared/providers/DateProvider/implementations/DayJSProvider';
import { exec } from 'child_process';
import { v4 } from 'uuid';



export const signPdf = async () => {
    const fileInputPath = 'prisma/signature/aso.pdf';
    const fileOutputPath = `tmp/a1-${(new Date()).getTime()}.pdf`;
    const certPath = `cert/cert_alex.pfx`;
    const passphrase = '230296';

    // run command
    // ./pdf2archive --quality=medium pdf/input.pdf pdf/output--medium.pdf
}