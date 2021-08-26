"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFetch = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const getFetch = (url, params = {}) => {
    return axios_1.default.get(url, params);
};
exports.getFetch = getFetch;
