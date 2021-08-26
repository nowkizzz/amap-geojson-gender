"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataVUrl = exports.getAmapUrl = void 0;
const config_1 = require("../core/config");
const getAmapUrl = (name, subdistrict, extensions = 'all') => {
    return `https://restapi.amap.com/v3/config/district?keywords=${encodeURIComponent(name)}&subdistrict=${subdistrict}&extensions=${extensions}key=${config_1.AMAP_KEY}`;
};
exports.getAmapUrl = getAmapUrl;
const getDataVUrl = (value) => {
    return `https://geo.datav.aliyun.com/areas_v3/bound/${value}_full.json`;
};
exports.getDataVUrl = getDataVUrl;
