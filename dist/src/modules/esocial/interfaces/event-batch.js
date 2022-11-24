"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcEmiEnum = exports.IndRetifEnum = exports.TpIncsEnum = exports.EventGroupEnum = exports.TpAmbEnum = void 0;
var TpAmbEnum;
(function (TpAmbEnum) {
    TpAmbEnum[TpAmbEnum["PROD"] = 1] = "PROD";
    TpAmbEnum[TpAmbEnum["PROD_REST"] = 2] = "PROD_REST";
    TpAmbEnum[TpAmbEnum["VALIDATION"] = 7] = "VALIDATION";
    TpAmbEnum[TpAmbEnum["TEST"] = 8] = "TEST";
    TpAmbEnum[TpAmbEnum["DEV"] = 9] = "DEV";
})(TpAmbEnum = exports.TpAmbEnum || (exports.TpAmbEnum = {}));
var EventGroupEnum;
(function (EventGroupEnum) {
    EventGroupEnum[EventGroupEnum["TABLES"] = 1] = "TABLES";
    EventGroupEnum[EventGroupEnum["NO_PERIODIC"] = 2] = "NO_PERIODIC";
    EventGroupEnum[EventGroupEnum["PERIODIC"] = 3] = "PERIODIC";
})(EventGroupEnum = exports.EventGroupEnum || (exports.EventGroupEnum = {}));
var TpIncsEnum;
(function (TpIncsEnum) {
    TpIncsEnum[TpIncsEnum["CNPJ"] = 1] = "CNPJ";
    TpIncsEnum[TpIncsEnum["CPF"] = 2] = "CPF";
})(TpIncsEnum = exports.TpIncsEnum || (exports.TpIncsEnum = {}));
var IndRetifEnum;
(function (IndRetifEnum) {
    IndRetifEnum[IndRetifEnum["ORIGINAL"] = 1] = "ORIGINAL";
    IndRetifEnum[IndRetifEnum["MODIFIED"] = 2] = "MODIFIED";
})(IndRetifEnum = exports.IndRetifEnum || (exports.IndRetifEnum = {}));
var ProcEmiEnum;
(function (ProcEmiEnum) {
    ProcEmiEnum[ProcEmiEnum["SOFTWARE"] = 1] = "SOFTWARE";
    ProcEmiEnum[ProcEmiEnum["GOV_WEB"] = 3] = "GOV_WEB";
    ProcEmiEnum[ProcEmiEnum["GOV_JURIDIC"] = 4] = "GOV_JURIDIC";
})(ProcEmiEnum = exports.ProcEmiEnum || (exports.ProcEmiEnum = {}));
//# sourceMappingURL=event-batch.js.map