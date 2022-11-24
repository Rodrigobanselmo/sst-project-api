"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalPCMSOEntity = exports.ProfessionalRiskGroupEntity = exports.UsersRiskGroupEntity = void 0;
const professional_entity_1 = require("../../users/entities/professional.entity");
class UsersRiskGroupEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UsersRiskGroupEntity = UsersRiskGroupEntity;
class ProfessionalRiskGroupEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.professional) {
            this.professional = new professional_entity_1.ProfessionalEntity(partial.professional);
        }
    }
}
exports.ProfessionalRiskGroupEntity = ProfessionalRiskGroupEntity;
class ProfessionalPCMSOEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ProfessionalPCMSOEntity = ProfessionalPCMSOEntity;
//# sourceMappingURL=usersRiskGroup.js.map