"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDbError = exports.updateFail = exports.findOneFail = exports.insertFail = void 0;
const tslib_1 = require("tslib");
const nedb_promises_1 = tslib_1.__importDefault(require("nedb-promises"));
const path_1 = tslib_1.__importDefault(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const isEqual_1 = tslib_1.__importDefault(require("lodash/isEqual"));
let failDataStore = nedb_promises_1.default.create(path_1.default.join(__dirname, '../../db/failDb.db'));
async function insertFail(value) {
    try {
        await failDataStore.insert(value);
    }
    catch (e) {
        console.log(chalk_1.default.redBright('入库失败', value));
    }
}
exports.insertFail = insertFail;
async function findOneFail(value) {
    try {
        return await failDataStore.findOne({ adcode: value.adcode });
    }
    catch (e) {
        console.log(chalk_1.default.redBright('查库失败', value));
        return null;
    }
}
exports.findOneFail = findOneFail;
async function updateFail(dbData, value) {
    try {
        console.log(value, 'update');
        const res = await failDataStore.update({ adcode: dbData.adcode }, { $set: value }, {});
        console.log('update返回内容', res);
    }
    catch (e) {
        console.log(chalk_1.default.redBright('入库失败', value));
    }
}
exports.updateFail = updateFail;
async function handleDbError(value) {
    try {
        const res = await findOneFail(value);
        if (res) {
            delete res._id;
            const is = isEqual_1.default(res, value);
            if (!is) {
                updateFail(res, value);
            }
        }
        else {
            await insertFail(value);
        }
    }
    catch (e) {
        console.log(chalk_1.default.redBright('处理入库失败', value));
    }
}
exports.handleDbError = handleDbError;
