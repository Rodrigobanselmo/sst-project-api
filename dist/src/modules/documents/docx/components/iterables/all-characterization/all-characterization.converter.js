"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayouts = exports.environmentsConverter = void 0;
const number_sort_1 = require("../../../../../../shared/utils/sorts/number.sort");
const hFullWidthImage_1 = require("../../../base/elements/imagesLayout/hFullWidthImage");
const hTwoImages_1 = require("../../../base/elements/imagesLayout/hTwoImages");
const imageDivider_1 = require("../../../base/elements/imagesLayout/imageDivider");
const vFullWidthImage_1 = require("../../../base/elements/imagesLayout/vFullWidthImage");
const vHImages_1 = require("../../../base/elements/imagesLayout/vHImages");
const vThreeImages_1 = require("../../../base/elements/imagesLayout/vThreeImages");
const vTwoImages_1 = require("../../../base/elements/imagesLayout/vTwoImages");
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const environmentsConverter = (environments) => {
    return environments
        .sort((a, b) => (0, number_sort_1.sortNumber)(a, b, 'order'))
        .map((environment) => {
        const imagesVertical = environment.photos.filter((image) => image.isVertical);
        const imagesHorizontal = environment.photos.filter((image) => !image.isVertical);
        const breakPage = imagesVertical.length > 0 || imagesHorizontal.length > 0;
        const elements = (0, exports.getLayouts)(imagesVertical, imagesHorizontal);
        const profileName = environment.profileParentId
            ? environment.name
            : environment.profileName
                ? `${environment.profileName} (${environment.name})`
                : environment.name;
        const variables = {
            [variables_enum_1.VariablesPGREnum.ENVIRONMENT_NAME]: environment.name || '',
            [variables_enum_1.VariablesPGREnum.PROFILE_NAME]: profileName || '',
            [variables_enum_1.VariablesPGREnum.ENVIRONMENT_DESCRIPTION]: environment.description || '',
            [variables_enum_1.VariablesPGREnum.ENVIRONMENT_NOISE]: environment.noiseValue || '',
            [variables_enum_1.VariablesPGREnum.ENVIRONMENT_TEMPERATURE]: environment.temperature || '',
            [variables_enum_1.VariablesPGREnum.ENVIRONMENT_LUMINOSITY]: environment.luminosity || '',
            [variables_enum_1.VariablesPGREnum.ENVIRONMENT_MOISTURE]: environment.moisturePercentage || '',
        };
        const risks = environment.homogeneousGroup.riskFactorData.map((risk) => risk.riskFactor);
        const considerations = environment.considerations;
        const activities = environment.activities;
        const type = environment.type;
        const id = environment.id;
        const profileParentId = environment.profileParentId;
        const profiles = environment.profiles;
        const paragraphs = environment.paragraphs;
        return {
            elements,
            variables,
            type,
            id,
            risks,
            considerations,
            breakPage,
            activities,
            profileParentId,
            profileName,
            profiles,
            paragraphs,
        };
    });
};
exports.environmentsConverter = environmentsConverter;
const getLayouts = (vPhotos, hPhotos) => {
    const vLength = vPhotos.length;
    const hLength = hPhotos.length;
    const isAllLegendEqual = [...vPhotos, ...hPhotos].every((photo) => vPhotos[0] && photo.name === vPhotos[0].name);
    const layouts = [];
    const vLayout = (vPhotos, length, keepVTree = false) => {
        const hasDivider = layouts.length > 0;
        if (hasDivider)
            layouts.push([(0, imageDivider_1.ImageDivider)()]);
        if (length >= 3 || (keepVTree && length > 0)) {
            const removeLegend = isAllLegendEqual && (length - 3 !== 0 || hLength !== 0);
            layouts.push((0, vThreeImages_1.VThreeImages)([vPhotos[0].photoUrl, vPhotos[1] ? vPhotos[1].photoUrl : '', vPhotos[2] ? vPhotos[2].photoUrl : ''], [vPhotos[0].name, vPhotos[1] ? vPhotos[1].name : '', vPhotos[2] ? vPhotos[2].name : ''], removeLegend));
            const restOfPhotos = vPhotos.slice(3);
            return vLayout(restOfPhotos, restOfPhotos.length, true);
        }
        if (length >= 2) {
            const removeLegend = isAllLegendEqual && (length - 2 !== 0 || hLength !== 0);
            layouts.push((0, vTwoImages_1.VTwoImages)([vPhotos[0].photoUrl, vPhotos[1].photoUrl], [vPhotos[0].name, vPhotos[1].name], removeLegend));
            const restOfPhotos = vPhotos.slice(2);
            return vLayout(restOfPhotos, restOfPhotos.length);
        }
        return vPhotos;
    };
    const hLayout = (hPhotos, vPhotos, hLength) => {
        const hasDivider = layouts.length > 0;
        if (hasDivider)
            layouts.push([(0, imageDivider_1.ImageDivider)()]);
        if (vPhotos.length >= 1) {
            const removeLegend = isAllLegendEqual && hLength > 1;
            if (hLength == 0) {
                layouts.push((0, vFullWidthImage_1.VFullWidthImage)(vPhotos[0].photoUrl, vPhotos[0].name));
                return;
            }
            if (hLength > 0) {
                layouts.push((0, vHImages_1.VHImages)([vPhotos[0].photoUrl, hPhotos[0].photoUrl], [vPhotos[0].name, hPhotos[0].name], removeLegend));
                const restOfPhotos = hPhotos.slice(1);
                return hLayout(restOfPhotos, [], restOfPhotos.length);
            }
            const restOfPhotos = hPhotos.slice(3);
            return hLayout(restOfPhotos, [], restOfPhotos.length);
        }
        if (hLength >= 2) {
            const removeLegend = isAllLegendEqual && hLength - 2 !== 0;
            layouts.push((0, hTwoImages_1.HTwoImages)([hPhotos[0].photoUrl, hPhotos[1].photoUrl], [hPhotos[0].name, hPhotos[1].name], removeLegend));
            const restOfPhotos = hPhotos.slice(2);
            return hLayout(restOfPhotos, [], restOfPhotos.length);
        }
        if (hPhotos[0])
            layouts.push((0, hFullWidthImage_1.HFullWidthImage)(hPhotos[0].photoUrl, hPhotos[0].name));
    };
    const restOfVPhotos = vLayout(vPhotos, vLength);
    hLayout(hPhotos, restOfVPhotos, hLength);
    return layouts.reduce((acc, layout) => [...acc, ...layout], []);
};
exports.getLayouts = getLayouts;
//# sourceMappingURL=all-characterization.converter.js.map