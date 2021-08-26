"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
/**
 * 时间换成指定格式日期
 * eg.
 * dateFormat(11111111111111, 'Y年m月d日 H时i分')
 * → "2322年02月06日 03时45分"
 *
 * formats 格式包括
 * 1. Y-m-d
 * 2. Y-m-d H:i:s
 * 3. Y年m月d日
 * 4. Y年m月d日 H时i分
 */
function formatDate(time, formats = 'Y-m-d_His') {
    if (time === undefined || !time) {
        return '';
    }
    let date;
    if (typeof time === 'object') {
        date = time;
    }
    else {
        if (typeof time === 'string') {
            if (/^[0-9]+$/.test(time)) {
                // support "1616484158427"
                time = parseInt(time);
            }
            else {
                // support safari
                // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                time = time.replace(new RegExp(/-/gm), '/');
            }
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    return formats.replace(/Y|m|d|H|i|s/gi, (matches) => {
        const result = {
            Y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            H: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds()
        };
        return result[matches].toString().padStart(2, '0');
    });
}
exports.formatDate = formatDate;
