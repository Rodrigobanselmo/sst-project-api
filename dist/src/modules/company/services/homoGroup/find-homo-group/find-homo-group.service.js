"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindHomogenousGroupService = void 0;
const common_1 = require("@nestjs/common");
const HomoGroupRepository_1 = require("../../../../../modules/company/repositories/implementations/HomoGroupRepository");
let FindHomogenousGroupService = class FindHomogenousGroupService {
    constructor(homoGroupRepository) {
        this.homoGroupRepository = homoGroupRepository;
    }
    async execute(_a, user) {
        var { skip, take } = _a, query = __rest(_a, ["skip", "take"]);
        const homo = await this.homoGroupRepository.find(Object.assign(Object.assign({}, query), { companyId: user.targetCompanyId }), { skip, take });
        return homo;
    }
};
FindHomogenousGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HomoGroupRepository_1.HomoGroupRepository])
], FindHomogenousGroupService);
exports.FindHomogenousGroupService = FindHomogenousGroupService;
//# sourceMappingURL=find-homo-group.service.js.map