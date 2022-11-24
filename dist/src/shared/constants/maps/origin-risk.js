"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.originRiskMap = void 0;
const client_1 = require("@prisma/client");
exports.originRiskMap = {
    [client_1.CharacterizationTypeEnum.GENERAL]: {
        name: 'Visão Geral',
        type: 'Ambiente',
    },
    [client_1.CharacterizationTypeEnum.ADMINISTRATIVE]: {
        name: 'Ambiente Administrativo',
        type: 'Ambiente',
    },
    [client_1.CharacterizationTypeEnum.OPERATION]: {
        name: 'Ambiente Operacional',
        type: 'Ambiente',
    },
    [client_1.CharacterizationTypeEnum.SUPPORT]: {
        name: 'Ambiente de Apoio',
        type: 'Ambiente',
    },
    [client_1.CharacterizationTypeEnum.ACTIVITIES]: {
        name: 'Atividade',
        type: 'Mão de Obra',
    },
    [client_1.CharacterizationTypeEnum.EQUIPMENT]: {
        name: 'Equipamento',
        type: 'Mão de Obra',
    },
    [client_1.CharacterizationTypeEnum.WORKSTATION]: {
        name: 'Posto de Trabalho',
        type: 'Mão de Obra',
    },
    [client_1.HierarchyEnum.DIRECTORY]: {
        name: 'Diretoria',
        type: 'Nível Hierarquico',
        prioritization: 7,
    },
    [client_1.HierarchyEnum.MANAGEMENT]: {
        name: 'Gerência',
        type: 'Nível Hierarquico',
        prioritization: 6,
    },
    [client_1.HierarchyEnum.SECTOR]: {
        name: 'Setor',
        type: 'Nível Hierarquico',
        prioritization: 5,
    },
    [client_1.HierarchyEnum.SUB_SECTOR]: {
        name: 'Sub Setor',
        type: 'Nível Hierarquico',
        prioritization: 4,
    },
    [client_1.HierarchyEnum.OFFICE]: {
        name: 'Cargo',
        type: 'Nível Hierarquico',
        prioritization: 2,
    },
    [client_1.HierarchyEnum.SUB_OFFICE]: {
        name: 'Cargo Desenvolvido',
        type: 'Nível Hierarquico',
        prioritization: 1,
    },
};
//# sourceMappingURL=origin-risk.js.map