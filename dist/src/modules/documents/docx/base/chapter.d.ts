import { ISectionOptions, Table } from 'docx';
interface IChapterProps {
    version: string;
    chapter: string;
}
export declare const createChapterPage: ({ version, chapter }: IChapterProps) => Table;
export declare const chapterSection: ({ version, chapter, }: IChapterProps) => ISectionOptions;
export {};
