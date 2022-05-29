export declare const getPathIdTreeMap: (id: number | string, nodes: Record<string, {
    id: number | string;
    parentId: string | number;
    children: (string | number)[];
}>) => (string | number)[];
