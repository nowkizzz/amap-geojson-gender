import { AMAP_KEY } from '../core/config';

export const getAmapUrl = (
  name: string,
  subdistrict: number,
  extensions = 'all'
): string => {
  return `https://restapi.amap.com/v3/config/district?keywords=${encodeURIComponent(
    name
  )}&subdistrict=${subdistrict}&extensions=${extensions}key=${AMAP_KEY}`;
};

export const getDataVUrl = (value: number | string) => {
  return `https://geo.datav.aliyun.com/areas_v3/bound/${value}_full.json`;
};
