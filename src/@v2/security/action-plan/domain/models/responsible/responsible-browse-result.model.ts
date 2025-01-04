
export type IResponsibleBrowseResultModel = {
    id: number;
    name: string;
    email: string;
}

export class ResponsibleBrowseResultModel {
    id: number;
    name: string;
    email: string;

    constructor(params: IResponsibleBrowseResultModel) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
    }
}