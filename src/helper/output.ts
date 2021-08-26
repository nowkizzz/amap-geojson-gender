import fsExtra from 'fs-extra';

export function outputJson(name: string, json: Record<string, any>) {
  fsExtra.outputJsonSync(name, json);
}
