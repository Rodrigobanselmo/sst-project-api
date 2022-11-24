import { ISectionOptions, Table } from 'docx';
interface IChapterProps {
    version: string;
    chapter: string;
    imagePath: string;
}
export declare const createChapterPage: ({ version, chapter, imagePath }: IChapterProps) => Table;
export declare const chapterSection: ({ version, chapter, imagePath }: IChapterProps) => ISectionOptions;
export {};
