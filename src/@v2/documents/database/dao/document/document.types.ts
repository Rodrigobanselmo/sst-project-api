export namespace IDocumentDAO {
  export type FindByIdParams = {
    documentVersionId: string;
    homogeneousGroupsIds?: string[];
    /** Fallback da fila quando o registro ainda não tem documentDate persistido. */
    documentDate?: string;
  };
}
