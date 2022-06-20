import { Header } from 'docx';
interface IHeaderProps {
    path: string;
}
export declare const createHeader: ({ path }: IHeaderProps) => {
    default: Header;
    first: Header;
};
export {};
