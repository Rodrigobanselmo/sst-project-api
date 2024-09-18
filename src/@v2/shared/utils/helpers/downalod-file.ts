import { v4 } from 'uuid';
import fs from 'fs';
import axios from 'axios';


type IDownloadFile = { url: string, filePath?: string }

const getFilePath = (url: string) => {
    const extension = url.split('/').at(-1).split('.')[1];
    return `tmp/${v4()}.${extension}`;
};

export const donwloadFile = async ({ url, filePath }: IDownloadFile): Promise<string | null> => {
    const path = filePath || getFilePath(url);

    return axios({
        url,
        responseType: 'stream',
    })
        .then(
            (response) =>
                new Promise<string>((resolve, reject) => {
                    response.data
                        .pipe(fs.createWriteStream(path))
                        .on('finish', () => resolve(path))
                        .on('error', (e) => reject(e));
                }),
        )
        .catch((e) => {
            console.error('donwloadFile', e?.message);
            return null;
        });
};