export interface Options {
  name: string;
  adcode: number;
  dist: string;
  backup: boolean;
  outputPath: string;
}

export type PlaceItem = {
  adcode: number | string;
  name: string;
};
