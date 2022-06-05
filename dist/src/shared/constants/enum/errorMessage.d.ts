export declare enum ErrorMessageEnum {
    FILE_WRONG_TABLE_HEAD = "Cabe\u00E7ario da tabela est\u00E1 com valores diferente do esperado, certifique-se que voc\u00EA possui a vers\u00E3o mais atualizada da tabela",
    NOT_FOUND_ON_COMPANY_TO_DELETE = "Dado a ser deletado n\u00E3o foi encontrado nesta empresa"
}
export declare enum ErrorCompanyEnum {
    CREATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'",
    UPDATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'",
    UPSERT_HIERARCHY_WITH_PARENT = "O campo 'parentId' \u00E9 obrigat\u00F3rio",
    GHO_NOT_FOUND = "O GHO informado n\u00E3o foi encontrado nesta empresa",
    WORKSPACE_NOT_FOUND = "O Estabelecimento (\u00E1rea de trabalho) informada n\u00E3o foi encontrada, verifique a sigla utilizada"
}
export declare enum ErrorInvitesEnum {
    FORBIDDEN_ACCESS_USER_INVITE_LIST = "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar a lista de convites de outro usu\u00E1rio ",
    TOKEN_EXPIRES = "O Convite expirou",
    TOKEN_NOT_VALID_EMAIL = "O Convite n\u00E3o \u00E9 v\u00E1lido para esse email"
}
export declare enum ErrorChecklistEnum {
    EPI_NOT_FOUND = "Epi n\u00E3o encontrado"
}
export declare enum ErrorDocumentEnum {
    NOT_FOUND = "Documento n\u00E3o encontrado"
}
export declare enum ErrorAuthEnum {
    USER_ALREADY_EXIST = "Usu\u00E1rio j\u00E1 cadastrado"
}
