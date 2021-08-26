"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fetch_1 = require("../helper/fetch");
const output_1 = require("../helper/output");
const url_1 = require("../helper/url");
const date_1 = require("../helper/date");
const db_1 = require("../helper/db");
const normalizeOptions_1 = tslib_1.__importDefault(require("../helper/normalizeOptions"));
const levels = ['country', 'province', 'city'];
const cwd = process.cwd();
const spinner = ora_1.default({
    prefixText: `${chalk_1.default.greenBright('[geojson tasks]')}`
});
class Generator {
    options;
    constructor(options) {
        this.options = normalizeOptions_1.default(options);
        this.init();
    }
    async init() {
        const { name, adcode } = this.options;
        // 备份目录
        this.backupGeoJson();
        // 清空目录
        this.emptyDistDir();
        // 开始请求地图json
        await this.getGeoJson({
            name,
            adcode
        });
        // 开始添加version文件
        this.addVersionFile();
    }
    backupGeoJson() {
        let date = '';
        const { outputPath } = this.options;
        try {
            const spinner = ora_1.default(chalk_1.default.yellowBright(`开始备份geoJson目录`)).start();
            if (fs_extra_1.default.pathExistsSync(outputPath)) {
                const versionPath = path_1.default.join(cwd, 'geoJson/version');
                if (fs_extra_1.default.pathExistsSync(versionPath)) {
                    date = fs_extra_1.default.readFileSync(versionPath, 'utf-8');
                }
                const dateStr = date || date_1.formatDate(Date.now());
                fs_extra_1.default.copySync(outputPath, path_1.default.join(cwd, `backup/backup_${dateStr}`));
                spinner.succeed(chalk_1.default.greenBright(`备份目录成功，备份目录名为backup_${dateStr}`));
            }
            else {
                spinner.fail(chalk_1.default.red(`未发现geoJson目录，取消备份`));
            }
        }
        catch (e) {
            console.log(chalk_1.default.redBright('备份失败', e));
        }
    }
    addVersionFile() {
        const date = date_1.formatDate(Date.now());
        if (fs_extra_1.default.pathExistsSync(this.options.outputPath)) {
            fs_extra_1.default.writeFileSync(path_1.default.join(cwd, `${this.options.dist}/version`), date);
        }
    }
    emptyDistDir() {
        try {
            fs_extra_1.default.emptyDir(this.options.outputPath);
            console.log(chalk_1.default.greenBright('清空目录成功'));
        }
        catch (e) {
            console.log(chalk_1.default.redBright('清空目录失败', e));
        }
    }
    async getGeoJson(options) {
        const { name, adcode, parentName } = options;
        const { dist } = this.options;
        spinner.start(`正在请求${name}地图json(${adcode}.json) \n`);
        try {
            const url = url_1.getDataVUrl(adcode);
            const res = await fetch_1.getFetch(url);
            if (res && res.data) {
                spinner.start(`开始生成${name}地图json(${adcode}.json) \n`);
                try {
                    output_1.outputJson(path_1.default.join(cwd, `./${dist}/${adcode}.json`), res.data);
                    spinner.succeed(`${name}地图json(${adcode}.json)生成成功 \n`);
                    const { data } = res;
                    if (data.features && data.features.length > 0) {
                        if (!levels.includes(data.features[0].properties.level)) {
                            return;
                        }
                        for (const item of data.features) {
                            const properties = item.properties;
                            // childrenNum 大于0 才有下一层得json
                            // if (item.properties.childrenNum) {
                            await this.getGeoJson({
                                adcode: properties.adcode,
                                name: properties.name,
                                parentAdcode: adcode,
                                parentName: name
                            });
                            // }
                        }
                    }
                }
                catch (error) {
                    spinner.fail(chalk_1.default.red(`generate fail! \n ${error}`));
                }
            }
        }
        catch (e) {
            db_1.handleDbError(options);
            // 直接入库
            if (e.toString().indexOf('404') >= 0) {
                spinner.fail(chalk_1.default.red(`请求${parentName || ''}${name}地图json(${adcode}.json) 404 ! \n`));
            }
            else {
                spinner.fail(chalk_1.default.red(`请求${parentName || ''}${name}地图json(${adcode}.json)失败!  ${e} \n`));
            }
        }
    }
}
exports.Generator = Generator;
