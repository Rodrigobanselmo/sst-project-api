import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import xlsx from 'node-xlsx';
import { XMLAdapter } from './xml.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class NodeXMLAdapter implements XMLAdapter {
  async read(buffer: Buffer) {
    try {
      const workSheetsFromBuffer = xlsx.parse(buffer);
      return workSheetsFromBuffer as XMLAdapter.ReadResult[];
    } catch (error) {
      captureException({ error, message: 'Error occurred when reading the file' });
      throw new InternalServerErrorException(error, 'Error occurred when reading the file');
    }
  }
}
