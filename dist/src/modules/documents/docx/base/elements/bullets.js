"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulletsMoreLevels = exports.bulletsArray = exports.bulletsSpace = exports.bulletsNormal = void 0;
const paragraphs_1 = require("./paragraphs");
const bulletsNormal = (text, level = 0, options) => {
    return (0, paragraphs_1.paragraphNormal)(text, Object.assign({ bullet: {
            level,
        }, spacing: { line: 350, after: 80, before: 0 } }, options));
};
exports.bulletsNormal = bulletsNormal;
const bulletsSpace = (text, options) => {
    return (0, paragraphs_1.paragraphNormal)(`         ${text}`, Object.assign({ spacing: { line: 250, after: 80, before: 0 } }, options));
};
exports.bulletsSpace = bulletsSpace;
const bulletsArray = (bullets, options) => {
    return bullets.map(([text, level]) => (0, paragraphs_1.paragraphNormal)(text, Object.assign({ bullet: {
            level: level || 0,
        }, spacing: { line: 350, after: 80, before: 0 } }, options)));
};
exports.bulletsArray = bulletsArray;
const bulletsMoreLevels = (bullets, options) => {
    return bullets
        .map((text) => {
        if (Array.isArray(text)) {
            return text.map((line, index) => {
                return (0, paragraphs_1.paragraphNormal)(line, Object.assign({ bullet: {
                        level: index === 0 ? 0 : 1,
                    } }, options));
            });
        }
        if (typeof text === 'string') {
            return [
                (0, paragraphs_1.paragraphNormal)(text, Object.assign({ bullet: {
                        level: 0,
                    } }, options)),
            ];
        }
    })
        .reduce((acc, array) => {
        return [...acc, ...array];
    }, []);
};
exports.bulletsMoreLevels = bulletsMoreLevels;
//# sourceMappingURL=bullets.js.map