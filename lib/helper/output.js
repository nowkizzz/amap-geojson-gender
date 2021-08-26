"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputJson = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
function outputJson(name, json) {
    fs_extra_1.default.outputJsonSync(name, json);
}
exports.outputJson = outputJson;
