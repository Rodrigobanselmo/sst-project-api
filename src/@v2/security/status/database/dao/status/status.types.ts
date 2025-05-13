export namespace IStatusDAO {
  export type BrowseParams = {
    companyId: string;
    type?: string;
  };

  export type CheckIfExistParams = {
    companyId: string;
    name: string;
    type: string;
  };
}
