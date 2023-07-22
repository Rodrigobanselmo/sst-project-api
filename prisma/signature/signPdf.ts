import { getPfxData } from './../../src/shared/utils/getPfxData';

import { readFileSync, writeFileSync, createWriteStream } from 'fs';
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

function splitString(str) {
    const words = str.split(' ');
    let result = '';
    let remaining = '';

    for (const word of words) {
        if ((result + word).length <= 33) {
            result += word + ' ';
        } else {
            remaining = words.slice(result.trim().split(' ').length).join(' ');
            break;
        }
    }

    result = result.trim();
    remaining = remaining.trim();

    return { firstSubstring: result, remainingString: remaining };
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(stdout);
        });
    });
}


export const signPdf = async () => {
    // const fileInputPath_before = 'prisma/signature/aso.pdf';
    // const fileOutputPath_before = `tmp/small-${v4()}.pdf`;
    // const command_compress = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${fileOutputPath_before} ${fileInputPath_before}`;

    // try {
    //     await executeCommand(command_compress);
    // } catch (error) {
    //     throw new BadRequestException(`Command execution failed with error: ${error.message}`);
    // }

    // const fileInputPath = fileOutputPath_before || 'prisma/signature/aso.pdf';
    const fileInputPath = 'prisma/signature/aso.pdf';
    const fileOutputPath = `tmp/a1-${(new Date()).getTime()}.pdf`;
    const certPath = `cert/cert_alex.pfx`;
    const passphrase = '230296';

    const command = `gs -dPDFA -dBATCH -dNOPAUSE -sColorConversionStrategy=UseDeviceIndependentColor -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=2 -sOutputFile=${fileOutputPath} ${fileInputPath}`;
    // const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${fileOutputPath} -dPDFA -dPDFACompatibilityPolicy=1 ${fileInputPath}`;

    try {
        await executeCommand(command);
    } catch (error) {
        throw new BadRequestException(`Command execution failed with error: ${error.message}`);
    }

    const pdfBuffer = readFileSync(fileOutputPath);
    const p12Buffer = readFileSync(certPath);
    const SIGNATURE_LENGTH = p12Buffer.length * 2;

    const date = new Date();


    //! simple
    // const pdfBufferToSign = plainAddPlaceholder({
    //     pdfBuffer,
    //     reason: 'Signed Certificate.',
    //     contactInfo: 'sign@example.com',
    //     name: 'Example',
    //     location: 'Jakarta',
    //     signatureLength: p12Buffer.length,
    // });

    // const signer = new SignPdf()
    // const signedPdf = signer.sign(pdfBufferToSign, p12Buffer, { passphrase: passphrase });
    // const bufferPdf = Buffer.from(signedPdf)

    // const pathSignedPdf2 = 'signed.pdf'
    // createWriteStream(pathSignedPdf2).write(bufferPdf);

    // return


    const formattedTime = date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZoneName: 'short',
    });

    const { pem } = await getPfxData({ buffer: p12Buffer, password: passphrase });
    const signerName = pem.attributes.subject.commonName;

    if (!signerName) throw new BadRequestException('No signer name found in certificate');

    const { firstSubstring, remainingString } = splitString(signerName)
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const imageBytes = readFileSync('images/logo/logo-simple-fade.jpg');
    const pdfLibSigImg = await pdfDoc.embedJpg(imageBytes);
    const pdfLibSigImgName = 'PDF_LIB_SIG_IMG';

    const pages = pdfDoc.getPages();
    const FontHelvetica = pdfDoc.embedStandardFont(StandardFonts.Helvetica)

    const ByteRange = PDFArray.withContext(pdfDoc.context);
    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = pdfDoc.context.obj({
        FT: 'Sig',
        Kids: [],
        Type: 'Sig',
        Filter: 'Adobe.PPKLite',
        SubFilter: 'adbe.pkcs7.detached',
        ByteRange,
        Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
        Reason: PDFString.of('Assinatura digital com validade jurídica para validar documento PDF'),
        M: PDFString.fromDate(new Date()),
    });

    const signatureDictRef = pdfDoc.context.register(signatureDict);

    const widgetDict = pdfDoc.context.obj({
        Type: 'Annot',
        Subtype: 'Widget',
        FT: 'Sig',
        Rect: [250, 110, 50, 60],
        V: signatureDictRef,
        T: PDFString.of('Signature1'),
        F: 4,
        P: pages[0].ref,

    });

    const widgetDictRef = pdfDoc.context.register(widgetDict);

    pages[0].node.set(PDFName.of('Annots'), pdfDoc.context.obj([widgetDictRef]));

    pdfDoc.catalog.set(
        PDFName.of('AcroForm'),
        pdfDoc.context.obj({
            SigFlags: 3,
            Fields: [widgetDictRef],
        }),
    );

    const form = pdfDoc.getForm();
    const sig = form.getSignature('Signature1');

    sig.acroField.getWidgets().forEach((widget) => {
        const { context } = widget.dict;
        const { width, height } = widget.getRectangle();

        const appearance = [
            ...drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: height,
                borderWidth: 1,
                color: rgb(1, 1, 1),
                borderColor: rgb(1, 1, 1),
                rotate: degrees(0),
                xSkew: degrees(0),
                ySkew: degrees(0),
            }),
            ...drawImage(pdfLibSigImgName, {
                x: width + 80,
                y: height + 5,
                width: width + 155,
                height: height + 10,
                rotate: degrees(180),
                xSkew: degrees(0),
                ySkew: degrees(0),
            }),
            ...drawText(FontHelvetica.encodeText(`Assinado de forma digital por`), {
                color: rgb(0, 0, 0),
                font: StandardFonts.Helvetica,
                size: 10,
                x: width + 10,
                y: height + 37,
                rotate: degrees(0),
                xSkew: degrees(0),
                ySkew: degrees(0),
            }),
            ...drawText(FontHelvetica.encodeText(firstSubstring), {
                color: rgb(0, 0, 0),
                font: StandardFonts.Helvetica,
                size: 8,
                x: width + 10,
                y: height + 26,
                rotate: degrees(0),
                xSkew: degrees(0),
                ySkew: degrees(0),
            }),
            ...drawText(FontHelvetica.encodeText(remainingString), {
                color: rgb(0, 0, 0),
                font: StandardFonts.Helvetica,
                size: 8,
                x: width + 10,
                y: height + 15,
                rotate: degrees(0),
                xSkew: degrees(0),
                ySkew: degrees(0),
            }),
            ...drawText(FontHelvetica.encodeText(`Data: ${formattedTime}`), {
                color: rgb(0, 0, 0),
                font: StandardFonts.Helvetica,
                size: 8,
                x: width + 10,
                y: height + 5,
                rotate: degrees(0),
                xSkew: degrees(0),
                ySkew: degrees(0),
            }),

        ];

        const stream = context.formXObject(appearance, {
            Resources: {
                XObject: { [pdfLibSigImgName]: pdfLibSigImg.ref },
                Font: pdfDoc.context.obj({
                    Helvetica: FontHelvetica.ref,
                }),
            },
            BBox: context.obj([0, 0, width, height]),
            Matrix: context.obj([1, 0, 0, 1, 0, 0]),
        });
        const streamRef = context.register(stream);

        widget.setNormalAppearance(streamRef);
    });

    const modifiedPdfBytes = await pdfDoc.save({ useObjectStreams: false, updateFieldAppearances: false });
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

    const signObj = new SignPdf();
    const signedPdfBuffer = signObj.sign(modifiedPdfBuffer, p12Buffer, {
        passphrase: passphrase,
    });

    const pathSignedPdf = 'signed.pdf'
    writeFileSync(pathSignedPdf, signedPdfBuffer);
}