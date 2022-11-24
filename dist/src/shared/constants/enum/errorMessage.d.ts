export declare enum ErrorMessageEnum {
    FILE_WRONG_TABLE_HEAD = "Cabe\u00E7ario da tabela est\u00E1 com valores diferente do esperado, certifique-se que voc\u00EA possui a vers\u00E3o mais atualizada da tabela",
    EMAIL_NOT_SEND = "Erro no envio de email",
    NOT_FOUND_ON_COMPANY_TO_DELETE = "Dado a ser deletado n\u00E3o foi encontrado nesta empresa",
    PRISMA_ERROR = "Desculpe, algo de errado acontenceu, informe o suporte para mais detalhes",
    FORBIDDEN_ACCESS = "Voc\u00EA n\u00E3o tem permiss\u00E3o para realizar essa esta a\u00E7\u00E3o",
    PROFESSIONAL_NOT_FOUND = "Profissional n\u00E3o encontrado ou sem premiss\u00F5es de acesso",
    CONTACT_NOT_FOUND = "Contato n\u00E3o encontrado ou sem premiss\u00F5es de acesso",
    CONTACT_IS_PRINCIPAL = "Voc\u00EA n\u00E3o pode deletar o contato principal",
    DOCUMENT_NOT_FOUND = "Documento n\u00E3o encontrado ou sem premiss\u00F5es de acesso",
    DOCUMENT_IS_PRINCIPAL = "Voc\u00EA n\u00E3o pode deletar o Documento principal",
    WRONG_EMAIL_PASS = "Email ou senha incorreto",
    CLINIC_EXAM_ALREADY_EXIST = "Exame j\u00E1 cadastrado para est\u00E1 cl\u00EDnica",
    EMPLOYEE_NOT_FOUND = "Empregado n\u00E3o encontrado para esta empresa",
    EMPLOYEE_FORBIDDEN_ADM_TWICE = "Funcion\u00E1rio j\u00E1 possui uma lota\u00E7\u00E3o ativa",
    EMPLOYEE_MISSING_HIERARCHY = "\u00C9 necessario informar o cargo do funcion\u00E1rio",
    EMPLOYEE_NOT_IN_HIERARCHY = "Funcion\u00E1rio sem v\u00EDnculo empregat\u00EDcio para esse tipo de lota\u00E7\u00E3o",
    EMPLOYEE_BLOCK_HISTORY = "hist\u00F3rico bagun\u00E7ado, verifique se sua a\u00E7\u00E3o \u00E9 v\u00E1lida",
    EMPLOYEE_HISTORY_NOT_FOUND = "hist\u00F3rico de exame n\u00E3o encontrado",
    EMPLOYEE_HISTORY_FILE_NOT_UPLOADED = "n\u00E3o foi possivel fazer upload do arquivo",
    PROTOCOL_NOT_FOUND = "Protocolo n\u00E3o encontrado ou sem premiss\u00F5es de acesso"
}
export declare enum ErrorCompanyEnum {
    INVALID_CPF = "CPF inv\u00E1lido",
    CREATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'",
    UPDATE_HIERARCHY_WITH_PARENT = "O campo 'parentId' n\u00E3o pode existir para o tipo 'Directory'",
    UPSERT_HIERARCHY_WITH_PARENT = "O campo 'parentId' \u00E9 obrigat\u00F3rio",
    UPSERT_HIERARCHY_WITH_EMPLOYEE_WITH_SUB_OFFICE = "N\u00E3o \u00E9 possivel trocar de cargo empregados que est\u00E3o vinculados a cargos desenvolvidos",
    UPSERT_HIERARCHY_WITH_SUB_OFFICE_OTHER_OFFICE = "N\u00E3o \u00E9 possivel adicionar um empregado de outro cargo a um cargo desenvolvido",
    EVERYONE_NOT_FROM_SAME_OFFICE = "Os empregados precisam estar no mesmo cargo",
    GHO_NOT_FOUND = "O GHO informado n\u00E3o foi encontrado nesta empresa",
    ENVIRONMENT_NOT_FOUND = "O Ambiente requisitado n\u00E3o foi encontrado nesta empresa",
    CHARACTERIZATION_NOT_FOUND = "A Atividade requisitada n\u00E3o foi encontrado nesta empresa",
    HOMOGENEOUS_SAME_NAME = "J\u00E1 existe um grupo homog\u00EAneo com o mesmo nome",
    WORKSPACE_NOT_FOUND = "O Estabelecimento (\u00E1rea de trabalho) informada n\u00E3o foi encontrada, verifique a sigla utilizada",
    CPF_CONFLICT = "CPF j\u00E1 cadastrado",
    EMPLOYEE_NOT_FOUND = "Empregado n\u00E3o encontrado"
}
export declare enum ErrorInvitesEnum {
    FORBIDDEN_ACCESS_USER_INVITE_LIST = "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar a lista de convites de outro usu\u00E1rio ",
    TOKEN_EXPIRES = "O Convite expirou",
    TOKEN_NOT_VALID_EMAIL = "O Convite n\u00E3o \u00E9 v\u00E1lido para esse email",
    FORBIDDEN_INSUFFICIENT_PERMISSIONS = "Voc\u00EA n\u00E3o tem permiss\u00E3o para criar/editar um usu\u00E1rio com essas cred\u00EAnciais",
    USER_NOT_FOUND = "Usu\u00E1rio n\u00E3o encontrado",
    USER_ALREADY_EXIST = "Usu\u00E1rio j\u00E1 cadastrado",
    GOOGLE_USER_NOT_EXIST = "Nenhum usu\u00E1rio econtrado que esteja vinculado a esta conta Google",
    AUTH_GROUP_NOT_FOUND = "Grupo de permiss\u00F5es n\u00E3o enontrado",
    EMAIL_NOT_FOUND = "Usu\u00E1rio com o :v1 n\u00E3o encontrado",
    TOKEN_NOT_FOUND = "Convite n\u00E3o encontrado"
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
export declare enum ErrorFilesEnum {
    WRONG_TABLE_SHEET = "A tabela que est\u00E1 enviando possui um nome de planilha diferente do experado: enviado: ??FOUND??, esperado: ??EXPECTED??",
    WRONG_TABLE_VERSION = "A tabela que est\u00E1 enviando possui uma vers\u00E3o diferente, verifique se voc\u00EA possui a vers\u00E3o mais atualizada"
}
