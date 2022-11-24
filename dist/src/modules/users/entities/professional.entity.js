"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalEntity = void 0;
const openapi = require("@nestjs/swagger");
const user_entity_1 = require("./user.entity");
class ProfessionalEntity {
    constructor(partial) {
        var _a, _b, _c, _d;
        Object.assign(this, partial);
        if (this.professional) {
            delete this.professional.id;
            Object.assign(this, this.professional);
            delete this.professional;
        }
        if (partial === null || partial === void 0 ? void 0 : partial.user) {
            this.user = new user_entity_1.UserEntity(Object.assign({}, partial.user));
            if ((_a = this.user) === null || _a === void 0 ? void 0 : _a.name)
                this.name = this.user.name;
            if ((_b = this.user) === null || _b === void 0 ? void 0 : _b.cpf)
                this.cpf = this.user.cpf;
            if ((_c = this.user) === null || _c === void 0 ? void 0 : _c.phone)
                this.phone = this.user.phone;
            if ((_d = this.user) === null || _d === void 0 ? void 0 : _d.email)
                this.email = this.user.email;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, deleted_at: { required: true, type: () => Date, nullable: true }, companyId: { required: true, type: () => String }, formation: { required: true, type: () => [String] }, certifications: { required: true, type: () => [String] }, cpf: { required: true, type: () => String }, phone: { required: true, type: () => String }, type: { required: true, type: () => Object }, status: { required: true, type: () => Object }, user: { required: false, type: () => require("./user.entity").UserEntity }, userId: { required: true, type: () => Number }, invite: { required: true, type: () => require("./invite-users.entity").InviteUsersEntity }, inviteId: { required: true, type: () => String }, councils: { required: false, type: () => [require("./council.entity").ProfessionalCouncilEntity] }, professionalPgrSignature: { required: false, type: () => require("../../sst/entities/usersRiskGroup").ProfessionalRiskGroupEntity }, professionalsPgrSignatures: { required: false, type: () => [require("../../sst/entities/usersRiskGroup").ProfessionalRiskGroupEntity] }, professionalPcmsoSignature: { required: false, type: () => require("../../sst/entities/usersRiskGroup").ProfessionalPCMSOEntity }, professionalsPcmsoSignatures: { required: false, type: () => [require("../../sst/entities/usersRiskGroup").ProfessionalPCMSOEntity] }, professionalId: { required: false, type: () => Number }, professional: { required: false, type: () => Object }, councilType: { required: true, type: () => String }, councilUF: { required: true, type: () => String }, councilId: { required: true, type: () => String } };
    }
}
exports.ProfessionalEntity = ProfessionalEntity;
//# sourceMappingURL=professional.entity.js.map