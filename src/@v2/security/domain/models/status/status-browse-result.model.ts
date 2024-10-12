
export type IStatusBrowseResultModel = {
    id: number;
    name: string;
    color?: string;
}

export class StatusBrowseResultModel {
    id: number;
    name: string;
    color?: string;

    constructor(params: IStatusBrowseResultModel) {
        this.id = params.id;
        this.name = params.name;
        this.color = params.color;
    }
}