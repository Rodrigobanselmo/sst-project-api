export namespace ITaskService {
  export type Params = {
    companyId: string;
    photos: { fileId: string }[] | undefined;
  };
}
