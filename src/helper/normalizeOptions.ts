import { Options } from '../types';
import path from 'path';

export default function normalizeOptions(options?: Options) {
  let targetOptions = options || ({} as Options);
  targetOptions.name = targetOptions.name || '中国';
  targetOptions.adcode = targetOptions.adcode || 100000;
  targetOptions.backup = targetOptions.backup === false ? false : true;
  targetOptions.dist = targetOptions.dist || 'geoJson';
  targetOptions.outputPath = path.join(process.cwd(), targetOptions.dist);
  return targetOptions;
}
