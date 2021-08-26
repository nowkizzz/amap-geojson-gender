import { Options, PlaceItem } from '../types';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { getFetch } from '../helper/fetch';
import { outputJson } from '../helper/output';
import { getDataVUrl } from '../helper/url';
import { formatDate } from '../helper/date';
import { handleDbError } from '../helper/db';
import normalizeOptions from '../helper/normalizeOptions';

const levels = ['country', 'province', 'city'];
const cwd = process.cwd();
const spinner = ora({
  prefixText: `${chalk.greenBright('[geojson tasks]')}`
});

export class Generator {
  options: Options;

  constructor(options: Options) {
    this.options = normalizeOptions(options);
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
      const spinner = ora(chalk.yellowBright(`开始备份geoJson目录`)).start();
      if (fs.pathExistsSync(outputPath)) {
        const versionPath = path.join(cwd, 'geoJson/version');
        if (fs.pathExistsSync(versionPath)) {
          date = fs.readFileSync(versionPath, 'utf-8');
        }
        const dateStr = date || formatDate(Date.now());
        fs.copySync(outputPath, path.join(cwd, `backup/backup_${dateStr}`));
        spinner.succeed(
          chalk.greenBright(`备份目录成功，备份目录名为backup_${dateStr}`)
        );
      } else {
        spinner.fail(chalk.red(`未发现geoJson目录，取消备份`));
      }
    } catch (e) {
      console.log(chalk.redBright('备份失败', e));
    }
  }

  addVersionFile() {
    const date = formatDate(Date.now());
    if (fs.pathExistsSync(this.options.outputPath)) {
      fs.writeFileSync(path.join(cwd, `${this.options.dist}/version`), date);
    }
  }

  emptyDistDir() {
    try {
      fs.emptyDir(this.options.outputPath);
      console.log(chalk.greenBright('清空目录成功'));
    } catch (e) {
      console.log(chalk.redBright('清空目录失败', e));
    }
  }

  async getGeoJson(options) {
    const { name, adcode, parentName } = options;
    const { dist } = this.options;
    spinner.start(`正在请求${name}地图json(${adcode}.json) \n`);
    try {
      const url = getDataVUrl(adcode);
      const res = await getFetch(url);
      if (res && res.data) {
        spinner.start(`开始生成${name}地图json(${adcode}.json) \n`);
        try {
          outputJson(path.join(cwd, `./${dist}/${adcode}.json`), res.data);
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
        } catch (error) {
          spinner.fail(chalk.red(`generate fail! \n ${error}`));
        }
      }
    } catch (e) {
      handleDbError(options);
      // 直接入库
      if (e.toString().indexOf('404') >= 0) {
        spinner.fail(
          chalk.red(
            `请求${parentName || ''}${name}地图json(${adcode}.json) 404 ! \n`
          )
        );
      } else {
        spinner.fail(
          chalk.red(
            `请求${
              parentName || ''
            }${name}地图json(${adcode}.json)失败!  ${e} \n`
          )
        );
      }
    }
  }
}
