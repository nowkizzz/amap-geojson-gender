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
export declare function formatDate(time?: object | string | number | null, formats?: string): string;
