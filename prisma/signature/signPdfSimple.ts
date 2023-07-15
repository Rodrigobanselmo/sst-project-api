
import { readFileSync, createWriteStream } from 'fs';
import { SignPdf } from 'node-signpdf';

import { Buffer } from 'buffer';
import { plainAddPlaceholder } from 'node-signpdf/dist/helpers/index.js';


export const signFunc = async () => {
    const pathSignedPdf = 'signed.pdf'
    const pdfBuffer = readFileSync('test.pdf');
    const p12Buffer = readFileSync('cert/cert.pfx');
    const passphrase = 'Evc@7832';

    const pdfBufferToSign = plainAddPlaceholder({
        pdfBuffer,
        reason: 'Signed Certificate.',
        contactInfo: 'sign@example.com',
        name: 'Example',
        location: 'Jakarta',
        signatureLength: p12Buffer.length,
    });

    const signer = new SignPdf()
    const signedPdf = signer.sign(pdfBufferToSign, p12Buffer, { passphrase: passphrase });
    const bufferPdf = Buffer.from(signedPdf)

    createWriteStream(pathSignedPdf).write(bufferPdf);
}