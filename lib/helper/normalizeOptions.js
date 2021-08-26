"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
function normalizeOptions(options) {
    let targetOptions = options || {};
    targetOptions.name = targetOptions.name || '中国';
    targetOptions.adcode = targetOptions.adcode || 100000;
    targetOptions.backup = targetOptions.backup === false ? false : true;
    targetOptions.dist = targetOptions.dist || 'geoJson';
    targetOptions.outputPath = path_1.default.join(process.cwd(), targetOptions.dist);
    return targetOptions;
}
exports.default = normalizeOptions;
