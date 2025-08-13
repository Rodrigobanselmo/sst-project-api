export namespace IFormQuestionsAnswersDAO {
  export type BrowseParams = {
    filters: {
      companyId: string;
      formApplicationId: string;
      search?: string;
    };
  };
}
