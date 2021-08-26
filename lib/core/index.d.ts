import { Options } from '../types';
export declare class Generator {
    options: Options;
    constructor(options: Options);
    init(): Promise<void>;
    backupGeoJson(): void;
    addVersionFile(): void;
    emptyDistDir(): void;
    getGeoJson(options: any): Promise<void>;
}
